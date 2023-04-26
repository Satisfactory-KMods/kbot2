import { IJobOptions } from "../TaskManager";
import {
	DiscordGuildManager,
	UpdateGuild
}                      from "@server/lib/bot/guild.lib";
import DB_Guilds       from "@server/mongodb/DB_Guilds";

const JobOptions : IJobOptions = {
	Interval: 15 * 60000, // 5 minutes
	JobName: "DiscordGuilds",
	Task: async() => {
		if ( global.DiscordBot && DiscordBot.isReady() ) {
			const Guilds = DiscordBot.guilds.cache.map( guild => guild );
			for ( let guild of Guilds ) {
				if ( typeof guild.id === "string" ) {
					const GuildClass = await DiscordGuildManager.GetGuild( guild.id );
					if ( GuildClass?.IsValid ) {
						guild = GuildClass.getGuild!;
					}
				}
				// todo that looks ugly :/
				await guild.members.fetch();
				await guild.roles.fetch();
				await guild.invites.fetch();
				await guild.channels.fetch();
				await guild.bans.fetch();
				await guild.commands.fetch();
				await guild.autoModerationRules.fetch();
				await guild.emojis.fetch();
				await guild.stickers.fetch();

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