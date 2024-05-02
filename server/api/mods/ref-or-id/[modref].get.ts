import { eq, or } from '@kmods/drizzle-pg';
import { db } from '~/server/utils/db/postgres/pg';
import { viewMods } from '~/server/utils/db/postgres/views';

export default defineEventHandler(async (event) => {
	const id = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');

	return await db
		.select()
		.from(viewMods)
		.where(or(eq(viewMods.mod_id, id), eq(viewMods.mod_reference, id)))
		.firstOrThrow('Mod not found');
});
