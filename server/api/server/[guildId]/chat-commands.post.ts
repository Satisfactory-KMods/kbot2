import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scChatCommands, scChatCommandsTrigger } from '~/server/utils/db/postgres/schema';
import type { ChatCommandData } from './chat-commands.get';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const { triggers, reaction_text, enable_auto_matching } = (await readBody(
		event
	)) as ChatCommandData['data'][0];

	await db.transaction(async (trx) => {
		const command = await trx
			.insert(scChatCommands)
			.values({
				guild_id: guildId,
				reaction_text,
				enable_auto_matching
			})
			.returning()
			.firstOrThrow('Failed to update chat command data');

		if (Array.isArray(triggers)) {
			await trx.insert(scChatCommandsTrigger).values(
				triggers.map((trigger) => {
					return { ...trigger, command_id: command.command_id };
				})
			);
		}
	});

	return {
		success: true
	};
});
