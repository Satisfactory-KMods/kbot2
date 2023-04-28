import { JobOptions } from "../TaskManager";
import {
	DiscordGuildManager,
	UpdateGuild
}                     from "@server/lib/bot/guild.lib";
import DB_Guilds      from "@server/mongodb/DB_Guilds";

const JobOptions : JobOptions = {
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
				await guild.members.fetch().catch( () => {
				} );
				await guild.roles.fetch().catch( () => {
				} );
				await guild.invites.fetch().catch( () => {
				} );
				await guild.channels.fetch().catch( () => {
				} );
				await guild.bans.fetch().catch( () => {
				} );
				await guild.commands.fetch().catch( () => {
				} );
				await guild.autoModerationRules.fetch().catch( () => {
				} );
				await guild.emojis.fetch().catch( () => {
				} );
				await guild.stickers.fetch().catch( () => {
				} );

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