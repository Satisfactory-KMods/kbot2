import { IJobOptions } from "../TaskManager";
import { UpdateGuild } from "@server/lib/bot/guild.lib";
import DB_Guilds       from "@server/mongodb/DB_Guilds";

const JobOptions : IJobOptions = {
	Interval: 5 * 60000, // 5 minutes
	JobName: "DiscordGuilds",
	Task: async() => {
		if ( global.DiscordBot && DiscordBot.isReady() ) {
			const Guilds = DiscordBot.guilds.cache.map( guild => [ guild.id, guild.name ] );
			for ( const [ guildId, guildName ] of Guilds ) {
				await UpdateGuild( [ guildId, guildName ] );
			}
			await DB_Guilds.updateMany( { guildId: { $nin: Guilds.map( R => R[ 0 ] ) } }, { isInGuild: false } );
		}
	}
};

export default JobOptions;