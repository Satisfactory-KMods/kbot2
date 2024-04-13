import { and, eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scChatCommands } from '~/server/utils/db/postgres/schema';
import { zodUuid } from '~/server/utils/zodSchemas';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const chatcommandId = zodUuid(getRouterParam(event, 'id'), 'Chat command Id must be a UUID');

	await db
		.delete(scChatCommands)
		.where(
			and(eq(scChatCommands.command_id, chatcommandId), eq(scChatCommands.guild_id, guildId))
		)
		.returning()
		.firstOrThrow('Failed to delete chat command data');

	return {
		success: true
	};
});
