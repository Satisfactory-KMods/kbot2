import { and, eq } from '@kmods/drizzle-pg';
import {
	ChannelType,
	type Collection,
	type Guild,
	type GuildForumThreadCreateOptions,
	type MessageCreateOptions,
	type MessagePayload,
	type NonThreadGuildBasedChannel
} from 'discord.js';
import {
	db,
	scGuild,
	scGuildAdmins,
	scGuildConfiguration,
	scGuildPatreonSettings
} from '../../db/postgres/pg';

class DiscordGuild<TValid extends boolean = false> {
	public readonly guildId;
	private Valid = false;
	private guild: TValid extends true ? Guild : Guild | null = null as any;
	private lastFetch: Date = new Date(0);
	private fetchInterval: number = 60 * 60 * 1000;

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
				await trx.insert(scGuildPatreonSettings).values({
					guild_id: this.guildId
				});
			});
		}
	}

	private async initializeGuild() {
		await this.initializeGuildDatabase();
		const Guild = await db
			.select()
			.from(scGuild)
			.where(and(eq(scGuild.guild_id, this.guildId), eq(scGuild.active, true)))
			.first();

		this.guild =
			botClient.guilds.cache.find((guild) => {
				return guild.id === this.guildId;
			}) ??
			((await botClient.guilds.fetch(this.guildId).catch(() => {
				return null;
			})) as any);
		if (Guild && this.guild) {
			await this.doFetch();
			this.Valid = true;
		}
	}

	public isValid(): this is DiscordGuild<true> {
		return this.Valid;
	}

	public async doFetch() {
		if (this.lastFetch.valueOf() + this.fetchInterval <= Date.now() && this.guild) {
			await Promise.all([
				this.guild.members.fetch().catch(() => {}),
				this.guild.roles.fetch().catch(() => {}),
				this.guild.invites.fetch().catch(() => {}),
				this.guild.channels.fetch().catch(() => {}),
				this.guild.bans.fetch().catch(() => {}),
				this.guild.commands.fetch().catch(() => {}),
				this.guild.autoModerationRules.fetch().catch(() => {}),
				this.guild.emojis.fetch().catch(() => {}),
				this.guild.stickers.fetch().catch(() => {})
			]);
			this.lastFetch = new Date();
		}
	}

	static async constructGuild(guildId: string): Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild(guildId);
		await GuildClass.initializeGuild();
		return GuildClass;
	}

	public get getGuild(): Guild | null {
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
			return guild.channels.fetch(channelId).catch(() => {});
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
			return this.guild.members.fetch(memberId).catch(() => {});
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
			return await guild.members.fetch(userId).catch(() => {});
		}
		return undefined;
	}

	public async role(roleId: string) {
		const guild = this.getGuild;
		if (guild && roleId) {
			return await guild.roles.fetch(roleId).catch(() => {});
		}
		return undefined;
	}

	public async allTextChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (await guild.channels.fetch().catch(() => {}))?.filter((R) => {
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
			return (await guild.channels.fetch().catch(() => {}))?.filter((R) => {
				return R?.isVoiceBased;
			});
		}
		return undefined;
	}

	public async allForumChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (await guild.channels.fetch().catch(() => {}))?.filter((R) => {
				return R?.isThread;
			});
		}
		return [];
	}

	public async allChannels() {
		const guild = this.getGuild;
		if (guild) {
			return (await guild.channels.fetch().catch(() => {}))?.filter((R) => {
				return R?.isThread;
			});
		}
		return [];
	}

	public async allRoles() {
		const guild = this.getGuild;
		if (guild) {
			return await guild.roles.fetch().catch(() => {});
		}
		return [];
	}

	public async allMember() {
		const guild = this.getGuild;
		if (guild) {
			return await guild.roles.fetch().catch(() => {});
		}
		return [];
	}

	public async sendMessageInChannel(opt: {
		channelId: string;
		message: string | MessagePayload | MessageCreateOptions;
	}): Promise<boolean> {
		const channel = await this.textChannel(opt.channelId);
		if (channel) {
			return !!(await channel.send(opt.message).catch(() => {}));
		}
		return false;
	}

	public async sendForumThread(opt: {
		channelId: string;
		thread: GuildForumThreadCreateOptions;
	}): Promise<boolean> {
		const channel = await this.forumChannel(opt.channelId);
		if (channel && channel.isThreadOnly()) {
			return !!(await channel.threads.create(opt.thread).catch(() => {}));
		}
		return false;
	}

	get IsValid(): boolean {
		return this.Valid;
	}
}

export const DiscordGuildManager = new (class {
	private guilds = new Map<string, DiscordGuild>();

	public RemoveGuild(guildId: string): void {
		if (this.guilds.has(guildId)) {
			this.guilds.delete(guildId);
		}
	}

	public async GetGuild(guildId: string): Promise<DiscordGuild | null> {
		if (this.guilds.has(guildId)) {
			const guild = this.guilds.get(guildId);
			await guild!.doFetch();
			return guild!;
		} else {
			const GuildClass = await DiscordGuild.constructGuild(guildId);
			if (GuildClass.IsValid) {
				this.guilds.set(guildId, GuildClass);
				return GuildClass;
			}
		}
		return null;
	}
})();
