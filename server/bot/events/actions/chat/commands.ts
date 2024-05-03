import { MessageType, type Message } from 'discord.js';
import Fuse from 'fuse.js';
import type { GuildChatCommand } from '~/server/bot/utils/guild';
import { DiscordGuildManager } from '~/server/bot/utils/guildManager';
import { replayMessageWithContent } from '~/server/bot/utils/messageContent';
import { TriggerMatchTypes } from '~/server/utils/db/postgres/schema';
import { log } from '~/utils/logger';

export async function getChatMessageCommand(
	message: Message<true>
): Promise<GuildChatCommand | null> {
	const guild = await DiscordGuildManager.getGuild(message.guild.id);
	const config = guild.config;

	const prefix = config.base.chat_command_prefix;
	if (message.content.trim().startsWith(prefix)) {
		const content = message.content.trim().slice(prefix.length);
		return (
			config.chatCommands.find((c) => {
				return c.triggers.some((t) => {
					return t.type === TriggerMatchTypes.prefix && content.startsWith(t.trigger);
				});
			}) ?? null
		);
	}
	return null;
}

export async function reactToCommand(message: Message<true>, command: GuildChatCommand) {
	// get reponse message or if not found, use the trigger message
	const target = message.reference?.messageId ?? message.id;
	const targetMsg =
		message.type === MessageType.Reply
			? await message.channel.messages.fetch(target).catch(() => {
					return null;
				})
			: message;

	if (!targetMsg) {
		log('bot-error', `Failed to find target message for command`);
		return;
	}

	await replayMessageWithContent(targetMsg, command.reaction_text);
}

export async function fuzzySearch(message: Message<true>) {
	const guild = await DiscordGuildManager.getGuild(message.guild.id);
	const config = guild.config;

	for (const command of config.chatCommands) {
		const regex = command.triggers.filter((t) => {
			return t.type === TriggerMatchTypes.regex;
		});
		for (const trigger of regex) {
			try {
				const regex = new RegExp(trigger.trigger);
				if (message.content.match(regex)) {
					await replayMessageWithContent(message, command.reaction_text);
					return;
				}
			} catch (e) {
				log('bot-error', `Failed to parse regex: ${trigger.trigger}`);
			}
		}

		// Start Fuzzy Search
		const fuzzy = command.triggers.filter((t) => {
			return t.type === TriggerMatchTypes.fuzzy;
		});

		const collection = new Fuse([{ content: message.content }], {
			includeScore: true,
			ignoreFieldNorm: true,
			ignoreLocation: true,
			includeMatches: true,
			keys: ['content']
		});

		if (
			fuzzy.some((t) => {
				return collection.search(t.trigger).some((r) => {
					return r.score! <= t.match_percentage;
				});
			})
		) {
			await replayMessageWithContent(message, command.reaction_text);
			return;
		}
	}
}
