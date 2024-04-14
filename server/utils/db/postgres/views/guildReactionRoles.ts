import { getColumns, pgAggJsonBuildObject, pgAnyValue } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema, scReactionRoles, scReactionRolesEmojies } from '../schema';

export const viewGuildReactionRoles = kbot2Schema.view('guild_reaction_roles').as((db) => {
	const cols = getColumns(scReactionRoles);

	return db
		.select({
			...(Object.entries(cols).reduce((acc, [key, value]) => {
				return {
					...acc,
					[key]: pgAnyValue(value).as(key)
				};
			}, {}) as typeof cols),
			emojies: pgAggJsonBuildObject(scReactionRolesEmojies, { aggregate: true }).as('emojies')
		})
		.from(scReactionRoles)
		.leftJoin(scReactionRolesEmojies, ['message_id'])
		.groupBy(scReactionRoles.message_id);
});
