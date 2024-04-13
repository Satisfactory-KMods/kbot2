import { and, eq, notInArray } from '@kmods/drizzle-pg';
import {
	ChannelType,
	PermissionFlagsBits,
	type Collection,
	type Guild,
	type GuildForumThreadCreateOptions,
	type MessageCreateOptions,
	type MessagePayload,
	type NonThreadGuildBasedChannel
} from 'discord.js';
import { log } from '~/utils/logger';
import { db, scGuild, scGuildAdmins, scGuildConfiguration } from '../../utils/db/postgres/pg';
import { botClient } from '../bot';

export class DiscordGuild<TValid extends boolean = false> {
	public readonly guildId;
	private guild: TValid extends true ? Guild : Guild | null = null as any;
	private lastFetch: Date = new Date(0);
	private fetchInterval: number = 60 * 15 * 1000;

	private constructor(guildId: string) {
		this.guildId = guildId;
	}

	private async initializeGuildDatabase() {
		const exists = await db
			.select()
			.from(scGuild)
			.where(and(eq(scGuild.guild_id, this.guildId)))
			.first();

		if (!exists) {
			await db.transaction(async (trx) => {
				await trx.insert(scGuild).values({
					guild_id: this.guildId
				});
				await trx.insert(scGuildConfiguration).values({
					guild_id: this.guildId
				});
			});
		}
	}

	public async updateGuildDatas(fetch = true) {
		if (fetch) {
			await this.guild?.fetch();
			await this.doFetch().catch(() => {
				log('bot-warn', `Failed to fetch guild data for ${this.guildId}`);
			});
		}

		await db.transaction(async (trx) => {
			if (!this.guild) {
				return log('bot-warn', `Guild ${this.guildId} not found`);
			}

			await trx
				.update(scGuild)
				.set({
					name: this.guild.name,
					owner_id: this.guild.ownerId,
					active: true,
					image: this.guild.iconURL({ forceStatic: true }) ?? '',
					total_members: this.guild.memberCount,
					guild_created: new Date(this.guild.createdTimestamp)
				})
				.where(and(eq(scGuild.guild_id, this.guildId)));

			const usersWithPermission = this.guild.members.cache
				.filter((member) => {
					return (
						member.permissions.has(PermissionFlagsBits.Administrator) &&
						!member.user.bot
					);
				})
				.map((member) => {
					return member.id;
				});

			await db
				.delete(scGuildAdmins)
				.where(
					and(
						notInArray(scGuildAdmins.user_id, usersWithPermission),
						eq(scGuildAdmins.guild_id, this.guildId)
					)
				);
			await Promise.all(
				usersWithPermission.map((userId) => {
					return trx
						.insert(scGuildAdmins)
						.values({
							guild_id: this.guildId,
							user_id: userId
						})
						.onConflictDoNothing();
				})
			);

			log('bot', 'Guild data updated', this.guild.name);
		});
	}

	private async initializeGuild() {
		await this.initializeGuildDatabase();

		this.guild =
			botClient.guilds.cache.find((guild) => {
				return guild.id === this.guildId;
			}) ??
			((await botClient.guilds.fetch(this.guildId).catch(() => {
				return null;
			})) as any);

		if (this.guild) {
			await this.updateGuildDatas();
		} else {
			await db
				.update(scGuild)
				.set({ active: false })
				.where(and(eq(scGuild.guild_id, this.guildId)));
		}
	}

	public isValid(): this is DiscordGuild<true> {
		return this.guild !== null;
	}

	public async doFetch() {
		if (this.lastFetch.valueOf() + this.fetchInterval <= Date.now() && this.guild) {
			await Promise.all([
				this.guild.members.fetch().catch(() => {
					return null;
				}),
				this.guild.roles.fetch().catch(() => {
					return null;
				}),
				this.guild.invites.fetch().catch(() => {
					return null;
				}),
				this.guild.channels.fetch().catch(() => {
					return null;
				}),
				this.guild.bans.fetch().catch(() => {
					return null;
				}),
				this.guild.commands.fetch().catch(() => {
					return null;
				}),
				this.guild.autoModerationRules.fetch().catch(() => {
					return null;
				}),
				this.guild.emojis.fetch().catch(() => {
					return null;
				}),
				this.guild.stickers.fetch().catch(() => {
					return null;
				})
			]);
			this.lastFetch = new Date();
		}
	}

	static async constructGuild(guildId: string): Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild(guildId);
		await GuildClass.initializeGuild();
		return GuildClass;
	}

	public get getGuild() {
		return this.guild;
	}

	public async userHasPermission(userId: string): Promise<boolean> {
		const result = await db
			.select()
			.from(scGuildAdmins)
			.where(and(eq(scGuildAdmins.guild_id, this.guildId), eq(scGuildAdmins.user_id, userId)))
			.first();
		return !!result;
	}

	private getChannel(channelId: string) {
		const guild = this.getGuild;
		if (guild && channelId) {
			if (guild.channels.cache.has(channelId)) {
				return guild.channels.cache.get(channelId);
			}
			return guild.channels.fetch(channelId).catch(() => {
				return null;
			});
		}
		return undefined;
	}

	public async message(messageId: string, channelId: string) {
		const channel = await this.getChannel(channelId);
		if (channel && channel.isTextBased()) {
			if (channel.messages.cache.has(messageId)) {
				return channel.messages.cache.get(messageId);
			}
			return channel.messages.fetch(messageId);
		}
		return undefined;
	}

	public guildMember(memberId: string) {
		if (this.guild) {
			return this.guild.members.fetch(memberId).catch(() => {
				return null;
			});
		}
		return undefined;
	}

	public async chatChannel(channelId: string) {
		const channel = await this.getChannel(channelId);
		if (channel && channel.isTextBased()) {
			return channel;
		}
		return undefined;
	}

	public async voiceChannel(channelId: string) {
		const channel = await this.getChannel(channelId);
		if (channel && channel.isVoiceBased()) {
			return channel;
		}
		return undefined;
	}

	public async forumChannel(channelId: string) {
		const channel = await this.getChannel(channelId);
		if (channel && channel.type === ChannelType.GuildForum) {
			return channel;
		}
		return undefined;
	}

	public async textChannel(channelId: string) {
		const channel = await this.getChannel(channelId);
		if (channel && channel.isTextBased()) {
			return channel;
		}
		return undefined;
	}

	public async user(userId: string) {
		const guild = this.getGuild;
		if (guild && userId) {
			return await guild.members.fetch(userId).catch(() => {
				return null;
			});
		}
		return undefined;
	}

	public async role(roleId: string) {
		const guild = this.getGuild;
		if (guild && roleId) {
			return await guild.roles.fetch(roleId).catch(() => {
				return null;
			});
		}
		return undefined;
	}

	public everyoneRoleId() {
		const guild = this.getGuild;
		if (guild) {
			return guild.roles.everyone.id;
		}
		return undefined;
	}

	public async allTextChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (
				await guild.channels.fetch().catch(() => {
					return null;
				})
			)?.filter((R) => {
				return R?.isTextBased;
			});
		}
		return [];
	}

	public async allVoiceChannels(): Promise<
		Collection<string, NonThreadGuildBasedChannel | null> | undefined
	> {
		const guild = this.getGuild;
		if (guild) {
			return (
				await guild.channels.fetch().catch(() => {
					return null;
				})
			)?.filter((R) => {
				return R?.isVoiceBased;
			});
		}
		return undefined;
	}

	public async allForumChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (
				await guild.channels.fetch().catch(() => {
					return null;
				})
			)?.filter((R) => {
				return R?.isThread;
			});
		}
		return [];
	}

	public async allChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (
				await guild.channels.fetch().catch(() => {
					return null;
				})
			)?.filter((R) => {
				return R?.isThread;
			});
		}
		return [];
	}

	public async allRoles() {
		const guild = this.getGuild;
		if (guild) {
			return await guild.roles.fetch().catch(() => {
				return null;
			});
		}
		return [];
	}

	public async allMember() {
		const guild = this.getGuild;
		if (guild) {
			return await guild.roles.fetch().catch(() => {
				return null;
			});
		}
		return [];
	}

	public async sendMessageInChannel(opt: {
		channelId: string;
		message: string | MessagePayload | MessageCreateOptions;
	}): Promise<boolean> {
		const channel = await this.textChannel(opt.channelId);
		if (channel) {
			return !!(await channel.send(opt.message).catch(() => {
				return null;
			}));
		}
		return false;
	}

	public async sendForumThread(opt: {
		channelId: string;
		thread: GuildForumThreadCreateOptions;
	}): Promise<boolean> {
		const channel = await this.forumChannel(opt.channelId);
		if (channel && channel.isThreadOnly()) {
			return !!(await channel.threads.create(opt.thread).catch(() => {
				return null;
			}));
		}
		return false;
	}
}

export const DiscordGuildManager = new (class {
	private guilds = new Map<string, DiscordGuild>();

	public removeGuild(guildId: string): void {
		if (this.guilds.has(guildId)) {
			this.guilds.delete(guildId);
		}
	}

	public async getGuild(guildId: string, fetch = false): Promise<DiscordGuild> {
		const guild = this.guilds.get(guildId);
		if (guild) {
			if (fetch) {
				await guild.doFetch();
			}
			return guild;
		}

		const GuildClass = await DiscordGuild.constructGuild(guildId);
		this.guilds.set(guildId, GuildClass);
		return GuildClass;
	}
})();
