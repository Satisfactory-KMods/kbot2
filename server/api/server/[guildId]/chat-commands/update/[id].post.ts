import { and, eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scChatCommands, scChatCommandsTrigger } from '~/server/utils/db/postgres/schema';
import { zodUuid } from '~/server/utils/zodSchemas';
import type { ChatCommandData } from '../../chat-commands.get';

export default defineEventHandler(async (event) => {
	const { guildId, guildData } = await getRouteBaseParams(event);
	const chatcommandId = zodUuid(getRouterParam(event, 'id'), 'Chat command Id must be a UUID');
	const { triggers, reaction_text, enable_auto_matching } = (await readBody(event)) as Partial<
		ChatCommandData['data'][0]
	>;

	await db.transaction(async (trx) => {
		if (Array.isArray(triggers)) {
			await trx
				.delete(scChatCommandsTrigger)
				.where(eq(scChatCommandsTrigger.command_id, chatcommandId));
			await trx.insert(scChatCommandsTrigger).values(
				triggers.map((trigger) => {
					return { ...trigger, command_id: chatcommandId };
				})
			);
		}

		await trx
			.update(scChatCommands)
			.set({
				reaction_text,
				enable_auto_matching
			})
			.where(
				and(
					eq(scChatCommands.command_id, chatcommandId),
					eq(scChatCommands.guild_id, guildId)
				)
			)
			.returning()
			.firstOrThrow('Failed to update chat command data');
		guildData.setDirty();
	});
	return {
		success: true
	};
});
