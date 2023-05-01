import {
	json,
	LoaderFunction,
	redirect
}                                 from "react-router-dom";
import { validateLoginWithGuild } from "@hooks/useAuth";
import { LoaderGuild }            from "@app/types/routing";
import { tRPC_Guild }             from "@lib/tRPC";
import { EChannelType }           from "@shared/Enum/EDiscord";
import {
	DiscordForumChannel,
	DiscordRole,
	DiscordTextChannel,
	DiscordVoiceChannel
}                                 from "@shared/types/discord";
import { MO_Mod }                 from "@shared/types/MongoDB";

export interface GuildLayoutLoaderData extends LoaderGuild {
	textChannels : DiscordTextChannel[];
	forumChannels : DiscordForumChannel[];
	voiceChannels : DiscordVoiceChannel[];
	mods : MO_Mod[];
	roles : DiscordRole[];
}

const loader : LoaderFunction = async( { params } ) => {
	const query = await validateLoginWithGuild( params.guildId || "" );

	if ( !query.loggedIn || !query.guildData ) {
		return redirect( "/error/401" );
	}

	const [ textChannelsResult, forumChannelsResult, voiceChannelsResult, modsResult, rolesResult ] = await Promise.all( [
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.text
		} ),
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.forum
		} ),
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.voice
		} ),
		tRPC_Guild.modupdates.mods.query( {
			guildId: query.guildData?.guildId!
		} ),
		tRPC_Guild.roles.getrole.query( {
			guildId: query.guildData?.guildId!
		} )
	] );

	const textChannels : any[] = textChannelsResult?.channels || [];
	const forumChannels : any[] = forumChannelsResult?.channels || [];
	const voiceChannels : any[] = forumChannelsResult?.channels || [];
	const roles : any[] = rolesResult?.roles || [];
	const mods : any[] = modsResult?.mods || [];

	return json<GuildLayoutLoaderData>( { ...query, textChannels, forumChannels, voiceChannels, mods, roles } );
};

export {
	loader
};
