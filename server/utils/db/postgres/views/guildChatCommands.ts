import { getColumns, pgAggJsonBuildObject, pgAnyValue } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema, scChatCommands, scChatCommandsTrigger } from '../schema';

export const viewGuildChatCommands = kbot2Schema.view('guild_chat_commands').as((db) => {
	const cols = getColumns(scChatCommands);

	return db
		.select({
			...(Object.entries(cols).reduce((acc, [key, value]) => {
				return {
					...acc,
					[key]: pgAnyValue(value).as(key)
				};
			}, {}) as typeof cols),
			triggers: pgAggJsonBuildObject(scChatCommandsTrigger, { aggregate: true }).as(
				'triggers'
			)
		})
		.from(scChatCommands)
		.leftJoin(scChatCommandsTrigger, ['command_id'])
		.groupBy(scChatCommands.command_id);
});
