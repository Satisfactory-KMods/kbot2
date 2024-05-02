import type { Message } from 'discord.js';

export const MESSAGE_CHAR_LIMIT = 2000 as const;

export function splitMessageContent(content: string): string[] {
	const splitContent = content.split('\n');
	const result = [];
	let current = '';
	for (const line of splitContent) {
		if (current.length + line.length > MESSAGE_CHAR_LIMIT) {
			result.push(current);
			current = '';
		}
		current += `${line}\n`;
	}
	result.push(current);
	return result;
}

export async function replayMessageWithContent(message: Message<true>, content: string) {
	const splitContent = splitMessageContent(content);
	for (const part of splitContent) {
		await message.reply({
			content: part
		});
	}
}
