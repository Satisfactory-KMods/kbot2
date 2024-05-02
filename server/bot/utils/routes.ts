import { z } from 'zod';
import { DiscordGuildManager } from './guildManager';
import { hasPermissionForGuild } from './permissions';

export async function getRouteBaseParams(event: any, skipPermissionCheck?: boolean) {
	const { user } = await getServerSessionChecked(event);
	const guildId = zodNumeric(getRouterParam(event, 'guildId'), 'Server Id must be numeric');
	
	if (!skipPermissionCheck) {
		await hasPermissionForGuild(guildId, user.discordId);
	}

	// also intialize the guild if it doesn't exist
	const guildData = await DiscordGuildManager.getGuild(guildId, false);
	if (!guildData.isValid()) {
		throw createError({
			statusCode: 404,
			message: 'Guild not found'
		});
	}

	return { guildData, guildId, user };
}

export function getLimitOffset(
	event: any,
	{
		maxLimit = 100,
		defaultLimit = 20
	}: {
		maxLimit?: number;
		defaultLimit?: number | string;
	} = {}
) {
	const limit = z
		.string()
		.or(z.number())
		.transform((v) => {
			const num = parseInt(String(v));
			if (isNaN(num)) {
				throw new TypeError('Invalid limit');
			}
			if (num <= 0 || num > maxLimit) {
				throw new Error(`Invalid limit must be between 1 and ${maxLimit}`);
			}
			return num;
		})
		.parse(getQuery(event).limit ?? defaultLimit);
	const offset = z
		.string()
		.or(z.number())
		.transform((v) => {
			const num = parseInt(String(v));
			if (isNaN(num)) {
				throw new TypeError('Invalid offset');
			}
			if (num < 0) {
				throw new Error('Invalid offset must bigger or equals than 0');
			}
			return num;
		})
		.parse(getQuery(event).offset ?? '0');

	return { limit, offset };
}
