import { IJobOptions } from "../TaskManager";
import {
	DiscordGuildManager,
	UpdateGuild
}                      from "@server/lib/bot/guild.lib";
import DB_Guilds       from "@server/mongodb/DB_Guilds";

const JobOptions : IJobOptions = {
	Interval: 5 * 60000, // 5 minutes
	JobName: "DiscordGuilds",
	Task: async() => {
		if ( global.DiscordBot && DiscordBot.isReady() ) {
			const Guilds = DiscordBot.guilds.cache.map( guild => guild );
			for ( const guild of Guilds ) {
				await UpdateGuild( guild );
				await DiscordGuildManager.GetGuild( guild.id.toString() );
			}
			await DB_Guilds.updateMany( { guildId: { $nin: Guilds.map( R => R.id ) } }, { isInGuild: false } );
			for await ( const Guild of DB_Guilds.findOne( { isInGuild: false } ) ) {
				DiscordGuildManager.RemoveGuild( Guild.guildId );
			}
		}
	}
};

export default JobOptions;