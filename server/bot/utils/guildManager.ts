import type {
	Collection,
	GuildForumThreadCreateOptions,
	GuildForumThreadMessageCreateOptions,
	MessageCreateOptions,
	NonThreadGuildBasedChannel
} from 'discord.js';
import { ChannelType } from 'discord.js';
import { DiscordGuildBase } from './guild';
import { splitMessageContent } from './messageContent';

export class DiscordGuild<TValid extends boolean = false> extends DiscordGuildBase<TValid> {
	override isValid(): this is DiscordGuild<true> {
		return this.guild !== null;
	}

	static async constructGuild(guildId: string): Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild(guildId);
		await GuildClass.initializeGuild();
		return GuildClass;
	}

	public async isPatreon(userId: string): Promise<boolean> {
		const guild = this.getGuild;
		if (guild) {
			const member = await guild.members.fetch(userId).catch(() => {
				return null;
			});
			if (member) {
				return member.roles.cache.some((role) => {
					return this.config?.base?.patreon_ping_roles?.includes(role.id) ?? false;
				});
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
	}): Promise<boolean> {
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
				await channel.send(sendContent).catch(() => {
					return null;
				});
			}

			return !!(await channel.send(opt.message).catch(() => {
				return null;
			}));
		}
		return false;
	}

	public async sendForumThread(opt: {
		channelId: string;
		thread: GuildForumThreadCreateOptions & {
			message: GuildForumThreadMessageCreateOptions;
		};
	}): Promise<boolean> {
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
				return false;
			}

			for (const content of msgContent) {
				await thread.send(content).catch(() => {
					return null;
				});
			}

			return !!thread;
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
