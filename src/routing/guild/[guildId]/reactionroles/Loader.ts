import {
	json,
	LoaderFunction,
	redirect
}                           from "react-router-dom";
import {
	tRPC_Guild,
	tRPC_handleError
}                           from "@lib/tRPC";
import { MO_ReactionRoles } from "@shared/types/MongoDB";
import {
	DiscordMessage,
	DiscordTextChannel
}                           from "@shared/types/discord";

export interface GuildReactionRolesLoader {
	commands : MO_ReactionRoles[],
	messages : Record<string, DiscordMessage>,
	channels : Record<string, DiscordTextChannel>,
}

const queryReactionRoles = async( guildId : string ) : Promise<GuildReactionRolesLoader | undefined> => {
	const result = await tRPC_Guild.reactionroles.getReactionRoles.query( { guildId } ).catch( tRPC_handleError );

	if ( result ) {
		return {
			commands: result.commands as any,
			messages: result.messages as any,
			channels: result.channels as any
		}
	}

	return undefined
};

const loader : LoaderFunction = async( { params } ) => {
	const { guildId } = params;

	const result = await queryReactionRoles( guildId! );
	if ( !result ) {
		return redirect( "/error/404" )
	}

	return json<GuildReactionRolesLoader>( result );
};

export {
	queryReactionRoles,
	loader
};