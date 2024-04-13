import { boolean, pgEnum, real, text, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const pgCommandTriggerMatchType = pgEnum('command_trigger_match_type', [
	'prefix',
	'fuzzy',
	'regex'
]);

export const scChatCommands = kbot2Schema.table('discord_guild_chat_commands', {
	...defaultGuildFields,
	command_id: uuid('command_id').primaryKey().notNull().defaultRandom(),
	reaction_text: text('reaction_text').notNull().default(''),
	enable_auto_matching: boolean('enable_auto_matching').notNull().default(true)
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
	trigger: varchar('trigger', { length: 512 }).notNull(),
	match_percentage: real('match_percentage').notNull().default(0.75),
	type: pgCommandTriggerMatchType('type').notNull().default('prefix')
});
