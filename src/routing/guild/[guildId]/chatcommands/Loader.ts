import {
	json,
	LoaderFunction
}                          from "react-router-dom";
import { MO_ChatCommands } from "@shared/types/MongoDB";
import {
	tRCP_handleError,
	tRPC_Guild
}                          from "@lib/tRPC";

export interface GuildCommandsLoaderData {
	chatReactions : MO_ChatCommands[];
}

const loader : LoaderFunction = async( { params } ) => {
	const { guildId } = params;
	const chatReactionsResult = await tRPC_Guild.chatcommands.getcommands.query( { guildId: guildId! } ).catch( tRCP_handleError );
	const chatReactions : MO_ChatCommands[] = chatReactionsResult?.commands || [];

	return json<GuildCommandsLoaderData>( {
		chatReactions
	} );
};

export {
	loader
};