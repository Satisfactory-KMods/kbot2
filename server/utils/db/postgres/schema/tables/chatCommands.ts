import {
	bigint,
	bigserial,
	boolean,
	index,
	pgEnum,
	primaryKey,
	real,
	text,
	varchar
} from '@kmods/drizzle-pg/pg-core';
import { kbot2Schema } from '../pgSchema';
import { defaultGuildFields } from './guilds';

export const pgCommandTriggerMatchType = pgEnum('command_trigger_match_type', [
	'prefix',
	'fuzzy',
	'regex'
]);

export const TriggerMatchTypes = pgCommandTriggerMatchType.enum;

export const scChatCommands = kbot2Schema.table('discord_guild_chat_commands', {
	...defaultGuildFields,
	command_id: bigserial('command_id').primaryKey().notNull(),
	reaction_text: text('reaction_text').notNull().default(''),
	enable_auto_matching: boolean('enable_auto_matching').notNull().default(true)
});

export const scChatCommandsTrigger = kbot2Schema.table(
	'discord_guild_chat_commands_trigger',
	{
		command_id: bigint('command_id')
			.notNull()
			.references(
				() => {
					return scChatCommands.command_id;
				},
				{ onDelete: 'cascade' }
			),
		trigger: varchar('trigger', { length: 512 }).notNull(),
		match_percentage: real('match_percentage').notNull().default(0.75),
		type: pgCommandTriggerMatchType('type').notNull().default('prefix')
	},
	(t) => {
		return {
			index: index().on(t.command_id),
			primary: primaryKey({ columns: [t.command_id, t.trigger] })
		};
	}
);
