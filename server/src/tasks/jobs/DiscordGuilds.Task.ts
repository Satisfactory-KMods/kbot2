import { JobTask }     from "../TaskManager";
import DB_Guilds       from "@server/mongodb/DB_Guilds";
import { UpdateGuild } from "@server/lib/bot/guild.lib";

export default new JobTask(
	5 * 6000, // 5 minutes
	"DiscordGuilds",
	async() => {
		if ( global.DiscordBot && DiscordBot.isReady() ) {
			const Guilds = DiscordBot.guilds.cache.map( guild => [ guild.id, guild.name ] );
			for ( const [ guildId, guildName ] of Guilds ) {
				await UpdateGuild( [ guildId, guildName ] );
			}
			await DB_Guilds.deleteMany( { guildId: { $nin: Guilds.map( R => R[ 0 ] ) } } );
		}
	}
);
