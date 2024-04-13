import { and, eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scChatCommands, scChatCommandsTrigger } from '~/server/utils/db/postgres/schema';
import { zodUuid } from '~/server/utils/zodSchemas';
import type { ChatCommandData } from '../../chat-commands.get';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const chatcommandId = zodUuid(
		getRouterParam(event, 'guildId'),
		'Chat command Id must be a UUID'
	);
	const { triggers, reaction_text, enable_auto_matching } = (await readBody(event)) as Partial<
		ChatCommandData['data'][0]
	>;

	if (Array.isArray(triggers)) {
		await db
			.delete(scChatCommandsTrigger)
			.where(eq(scChatCommandsTrigger.command_id, chatcommandId));
		await db.insert(scChatCommandsTrigger).values(
			triggers.map((trigger) => {
				return { ...trigger, command_id: chatcommandId };
			})
		);
	}

	await db
		.update(scChatCommands)
		.set({
			reaction_text,
			enable_auto_matching
		})
		.where(
			and(eq(scChatCommands.command_id, chatcommandId), eq(scChatCommands.guild_id, guildId))
		)
		.returning()
		.firstOrThrow('Failed to update chat command data');

	return {
		success: true
	};
});
