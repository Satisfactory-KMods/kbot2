import {
	ChannelType,
	type Collection,
	type GuildForumThreadCreateOptions,
	type MessageCreateOptions,
	type MessagePayload,
	type NonThreadGuildBasedChannel
} from 'discord.js';
import { DiscordGuildBase } from './guild';

export class DiscordGuild<TValid extends boolean = false> extends DiscordGuildBase<TValid> {
	override isValid(): this is DiscordGuild<true> {
		return this.guild !== null;
	}

	static async constructGuild(guildId: string): Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild(guildId);
		await GuildClass.initializeGuild();
		return GuildClass;
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

export const DiscordGuildManager = new (class DiscordGuildManager {
	protected guilds = new Map<string, DiscordGuild>();

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
			await guild.updateGuildConfiguration();
			return guild;
		}

		const GuildClass = await DiscordGuild.constructGuild(guildId);
		this.guilds.set(guildId, GuildClass);
		return GuildClass;
	}
})();
