import type {
	Collection,
	GuildForumThreadCreateOptions,
	GuildForumThreadMessageCreateOptions,
	Message,
	MessageCreateOptions,
	NonThreadGuildBasedChannel
} from 'discord.js';
import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { DiscordGuildBase } from './guild';
import { splitMessageContent } from './messageContent';
import { hasPermissionForGuild } from './permissions';

export class DiscordGuild<TValid extends boolean = false> extends DiscordGuildBase<TValid> {
	override isValid(): this is DiscordGuild<true> {
		return this.guild !== null;
	}

	static async constructGuild(guildId: string): Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild(guildId);
		await GuildClass.initializeGuild();
		return GuildClass;
	}

	public async isMember(userId: string): Promise<boolean> {
		const guild = this.getGuild;
		if (guild) {
			return (
				guild.members.cache.has(userId) ||
				!!(await hasPermissionForGuild(this.guildId, userId))
			);
		}
		return false;
	}

	public async getAdmins(useCache = true): Promise<string[]> {
		const guild = this.getGuild;
		if (guild) {
			const admins = Array.from(
				(useCache
					? guild.roles.cache
					: await guild.roles.fetch().catch(() => {
							return [];
						})
				).values()
			).filter((role) => {
				return role.permissions.has(PermissionFlagsBits.Administrator);
			});

			if (admins) {
				return admins.reduce<string[]>((acc, role) => {
					return acc.concat(
						role.members.map((member) => {
							return member.id;
						})
					);
				}, []);
			}
		}
		return [];
	}

	public async isAdmin(userId: string): Promise<boolean> {
		const guild = this.getGuild;
		if (guild) {
			const member = await guild.members.fetch(userId).catch(() => {
				return null;
			});
			if (member) {
				return member.permissions.has(PermissionFlagsBits.Administrator);
			}
		}
		return false;
	}

	public async isPatreon(userId: string): Promise<boolean> {
		const guild = this.getGuild;
		if (guild) {
			const member = await guild.members.fetch(userId).catch(() => {
				return null;
			});
			if (member) {
				const hasRole = member.roles.cache.some((role) => {
					return this.config?.base?.patreon_ping_roles?.includes(role.id) ?? false;
				});
				if (!hasRole) {
					if (await this.isAdmin(userId)) {
						return true;
					}
				}

				return hasRole;
			}
		}
		return false;
	}

	protected getChannel(channelId: string) {
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
		message: string | MessageCreateOptions;
	}) {
		const messages: Message<true>[] = [];
		const channel = await this.textChannel(opt.channelId);
		if (channel) {
			let content: string;
			if (typeof opt.message === 'string') {
				content = opt.message;
			} else {
				content = opt.message.content ?? '';
			}

			const msgContent = splitMessageContent(content);

			for (let i = 0; i < msgContent.length; i++) {
				let sendContent: MessageCreateOptions;
				if (typeof opt.message === 'string' || i < msgContent.length - 1) {
					sendContent = {
						content: msgContent[i]
					};
				} else {
					sendContent = {
						...opt.message,
						content: msgContent[i]
					};
				}
				const msg = await channel.send(sendContent).catch(() => {
					return null;
				});

				if (!msg) {
					throw new Error('Failed to send message');
				}

				messages.push(msg);
			}
		}
		return messages;
	}

	public async sendForumThread(opt: {
		channelId: string;
		thread: GuildForumThreadCreateOptions & {
			message: GuildForumThreadMessageCreateOptions;
		};
	}) {
		const channel = await this.forumChannel(opt.channelId);
		if (channel && channel.isThreadOnly()) {
			const content: string = String(opt.thread.message.content ?? '');
			const msgContent = splitMessageContent(content);
			const first = msgContent.shift();

			const thread = await channel.threads
				.create({
					...opt.thread,
					message: {
						...opt.thread.message,
						content: first
					}
				})
				.catch(() => {
					return null;
				});

			if (!thread) {
				return null;
			}

			for (const content of msgContent) {
				await thread.send(content).catch(() => {
					return null;
				});
			}

			return thread;
		}
		return null;
	}
}

export const DiscordGuildManager = new (class DiscordGuildManager {
	protected guilds = new Map<string, DiscordGuild>();

	public removeGuild(guildId: string): void {
		if (this.guilds.has(guildId)) {
			this.guilds.delete(guildId);
		}
	}

	public async getGuildChecked(guildId: string, fetch = false): Promise<DiscordGuild<true>> {
		const guild = await this.getGuild(guildId, fetch);

		if (!guild.isValid()) {
			throw new Error('Invalid Guild');
		}

		return guild;
	}

	public async getGuild(guildId: string, fetch = false): Promise<DiscordGuild> {
		const guild = this.guilds.get(guildId);
		if (guild) {
			if (fetch) {
				await guild.doFetch();
			}
			await guild.updateGuildConfiguration();

			return guild;
		}

		const GuildClass = await DiscordGuild.constructGuild(guildId);
		this.guilds.set(guildId, GuildClass);
		return GuildClass;
	}
})();
