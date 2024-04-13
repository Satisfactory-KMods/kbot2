import { and, eq } from '@kmods/drizzle-pg';
import { db, scGuildAdmins } from '~/server/utils/db/postgres/pg';

export function hasPermissionForGuild(guildId: string, discordId: string, throwError = true) {
	return db
		.select()
		.from(scGuildAdmins)
		.where(and(eq(scGuildAdmins.guild_id, guildId), eq(scGuildAdmins.user_id, discordId)))
		.first()
		.then((r) => {
			if (throwError && !r) {
				throw createError({
					statusCode: 403,
					message: 'You do not have permission to access this server'
				});
			}
			return !!r;
		});
}
