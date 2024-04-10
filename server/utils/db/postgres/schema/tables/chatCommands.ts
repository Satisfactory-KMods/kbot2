import { colJson, uuid, varchar } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';
import { scGuild } from './guilds';

export const scChatCommands = dbSchema.table('discord_guild_chat_commands', {
	command_id: uuid('command_id').primaryKey().notNull().defaultRandom(),
	guild_id: varchar('guild_id', { length: 512 })
		.notNull()
		.references(
			() => {
				return scGuild.guild_id;
			},
			{ onDelete: 'cascade' }
		),
	reaction_text: varchar('reaction_text', { length: 2000 }),
	auto_reaction_matches: colJson('auto_reaction_matches').notNull().default(false)
});

export const scChatCommandsTrigger = dbSchema.table('discord_guild_chat_commands_trigger', {
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
