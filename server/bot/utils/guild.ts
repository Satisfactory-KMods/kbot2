import { and, eq, notInArray } from '@kmods/drizzle-pg';
import type { Guild } from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
import { db } from '~/server/utils/db/postgres/pg';
import { scGuild, scGuildAdmins, scGuildConfiguration } from '~/server/utils/db/postgres/schema';
import { viewGuildChatCommands, viewGuildReactionRoles } from '~/server/utils/db/postgres/views';
import { log } from '~/utils/logger';
import type { Return } from '~/utils/typeUtils';
import { botClient } from '../bot';
import { viewGuildConfig } from './../../utils/db/postgres/views/guildConfig';

export async function getFullGuildConfiguration(guildId: string, trx = db) {
	const [base, chatCommands, reactionRoles] = await Promise.all([
		trx
			.select()
			.from(viewGuildConfig)
			.where(and(eq(viewGuildConfig.guild_id, guildId)))
			.firstOrThrow(),
		trx
			.select()
			.from(viewGuildChatCommands)
			.where(and(eq(viewGuildChatCommands.guild_id, guildId))),
		trx
			.select()
			.from(viewGuildReactionRoles)
			.where(and(eq(viewGuildReactionRoles.guild_id, guildId)))
	]);

	return { base, chatCommands, reactionRoles };
}

export type GuildConfiguration = Return<typeof getFullGuildConfiguration>;
export type GuildConfigurationBase = GuildConfiguration['base'];
export type GuildChatCommand = GuildConfiguration['chatCommands'][0];
export type GuildReactionRole = GuildConfiguration['reactionRoles'][0];

export class DiscordGuildBase<TValid extends boolean = false> {
	public readonly guildId;
	protected guild: TValid extends true ? Guild : Guild | null = null as any;
	protected lastFetch: Date = new Date(0);
	protected fetchInterval: number = 60 * 15 * 1000;
	protected dirty = false;
	protected _config: Return<typeof getFullGuildConfiguration> = {
		base: null as any,
		chatCommands: [],
		reactionRoles: []
	};

	public get config() {
		return this._config;
	}

	public async updateGuildConfiguration(force?: boolean, trx = db) {
		if (this.isDirty || force) {
			this._config = await getFullGuildConfiguration(this.guildId, trx);
		}
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

	protected constructor(guildId: string) {
		this.guildId = guildId;
	}

	public setDirty() {
		this.dirty = true;
	}

	public get isDirty() {
		return this.dirty;
	}

	protected async initializeGuildDatabase() {
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

	protected async initializeGuild() {
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
			await this.updateGuildConfiguration(true);
		} else {
			await db
				.update(scGuild)
				.set({ active: false })
				.where(and(eq(scGuild.guild_id, this.guildId)));
		}
	}

	public isValid(): this is DiscordGuildBase<true> {
		return this.guild !== null;
	}
}
