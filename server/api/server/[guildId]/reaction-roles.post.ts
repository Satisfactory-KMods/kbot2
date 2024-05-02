import { reapplyReactionRoles } from '~/server/bot/events/actions/reaction/reactionRole';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db } from '~/server/utils/db/postgres/pg';
import { scReactionRoles, scReactionRolesEmojies } from '~/server/utils/db/postgres/schema';
import type { ReactionRoleData } from './reaction-roles.get';

export default defineEventHandler(async (event) => {
	const { guildId, guildData } = await getRouteBaseParams(event);
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
		const command = await trx
			.insert(scReactionRoles)
			.values({
				name,
				guild_id: guildId,
				message_id,
				channel_id
			})
			.returning()
			.firstOrThrow('Failed to update chat command data');

		if (Array.isArray(emojies)) {
			await trx.insert(scReactionRolesEmojies).values(
				emojies.map((emojie) => {
					return { ...emojie, message_id: command.message_id };
				})
			);
		} else {
			throw createError({
				status: 400,
				statusMessage: 'Invalid emojis'
			});
		}
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
