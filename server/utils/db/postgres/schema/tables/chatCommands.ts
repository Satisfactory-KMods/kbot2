import { colJson, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const scChatCommands = kbot2Schema.table('discord_guild_chat_commands', {
	...defaultGuildFields,
	command_id: uuid('command_id').primaryKey().notNull().defaultRandom(),
	reaction_text: varchar('reaction_text', { length: 2000 }),
	auto_reaction_matches: colJson('auto_reaction_matches').notNull().default(false)
});

export const scChatCommandsTrigger = kbot2Schema.table('discord_guild_chat_commands_trigger', {
	command_id: uuid('command_id')
		.primaryKey()
		.notNull()
		.defaultRandom()
		.references(
			() => {
				return scChatCommands.command_id;
			},
			{ onDelete: 'cascade' }
		),
	trigger: varchar('trigger', { length: 64 })
});
