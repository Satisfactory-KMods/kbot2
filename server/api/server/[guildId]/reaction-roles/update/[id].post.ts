import { eq } from '@kmods/drizzle-pg';
import { reapplyReactionRoles } from '~/server/bot/events/actions/reaction/reactionRole';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scReactionRoles, scReactionRolesEmojies } from '~/server/utils/db/postgres/schema';
import type { ReactionRoleData } from '../../reaction-roles.get';

export default defineEventHandler(async (event) => {
	const { guildData } = await getRouteBaseParams(event);
	const chatcommandId = zodNumeric(getRouterParam(event, 'id'), 'Chat command Id must be a UUID');
	const { emojies, name, message_id, channel_id } = (await readBody(
		event
	)) as ReactionRoleData['data'][0];

	const message = await guildData.message(message_id, channel_id);
	if (!message) {
		throw createError({
			status: 400,
			statusMessage: 'Invalid message_id'
		});
	}

	await db.transaction(async (trx) => {
		await trx
			.update(scReactionRoles)
			.set({ name })
			.where(eq(scReactionRoles.message_id, chatcommandId));

		if (Array.isArray(emojies)) {
			await trx
				.delete(scReactionRolesEmojies)
				.where(eq(scReactionRolesEmojies.message_id, chatcommandId));
			await trx.insert(scReactionRolesEmojies).values(
				emojies.map((emojies) => {
					return { ...emojies, message_id };
				})
			);
		}
		guildData.setDirty();
	});

	await guildData.updateGuildConfiguration(true);
	const data = guildData.config.reactionRoles.find((r) => {
		return r.message_id === message_id;
	});

	if (!data) {
		throw createError({
			status: 400,
			statusMessage: 'Something went wrong. Please try again.'
		});
	}

	await reapplyReactionRoles(message, data);

	return {
		success: true
	};
});
