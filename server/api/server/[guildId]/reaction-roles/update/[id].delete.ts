import { and, eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scReactionRoles } from '~/server/utils/db/postgres/schema';
import { log } from '~/utils/logger';

export default defineEventHandler(async (event) => {
	const { guildId, guildData } = await getRouteBaseParams(event);
	const messageId = zodNumeric(getRouterParam(event, 'id'), 'Chat command Id must be a UUID');

	const deleted = await db
		.delete(scReactionRoles)
		.where(
			and(eq(scReactionRoles.message_id, messageId), eq(scReactionRoles.guild_id, guildId))
		)
		.returning()
		.firstOrThrow('Failed to delete chat command data');

	guildData.setDirty();

	try {
		const msg = await guildData.message(deleted.message_id, deleted.channel_id);
		if (msg) {
			await msg.reactions.removeAll();
		}
	} catch (e: any) {
		log('error', e.message);
	}

	return {
		success: true
	};
});
