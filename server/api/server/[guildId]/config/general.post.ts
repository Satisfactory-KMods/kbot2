import { eq } from '@kmods/drizzle-pg';
import { getRouteBaseParams } from '~/server/bot/utils/routes';
import { db, scGuildConfiguration } from '~/server/utils/db/postgres/pg';

export default defineEventHandler(async (event) => {
	const { guildId } = await getRouteBaseParams(event);
	const {
		changelog_suggestion_channel_id,
		changelog_announce_hidden_mods,
		changelog_bug_channel_id,
		changelog_forum_id,
		chat_command_prefix,
		patreon_announcement_channel_id,
		patreon_changelog_forum,
		patreon_ping_roles,
		patreon_release_text,
		public_announcement_channel_id,
		public_changelog_forum,
		public_ping_roles,
		public_release_text,
		default_ping_role,
		update_text_channel_id
	} = (await readBody(event)) as Partial<typeof scGuildConfiguration.$inferInsert>;

	return await db
		.update(scGuildConfiguration)
		.set({
			changelog_suggestion_channel_id,
			changelog_announce_hidden_mods,
			changelog_bug_channel_id,
			changelog_forum_id,
			chat_command_prefix,
			patreon_announcement_channel_id,
			patreon_changelog_forum,
			patreon_ping_roles,
			patreon_release_text,
			public_announcement_channel_id,
			public_changelog_forum,
			public_ping_roles,
			public_release_text,
			default_ping_role,
			update_text_channel_id
		})
		.where(eq(scGuildConfiguration.guild_id, guildId))
		.returning()
		.firstOrThrow('Failed to update base config data');
});
