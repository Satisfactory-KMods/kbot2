import DB_Guilds from '@server/mongodb/DB_Guilds';

export const rGuildId = {
	c: async (guildId: any): Promise<boolean> => {
		if (typeof guildId === 'string') {
			return !!(await DB_Guilds.findOne({ guildId: guildId, isInGuild: true }));
		}
		return false;
	},
	m: 'Guild id not found or invalid input'
};
