import { FC }               from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                           from "react-router-dom";
import { IMO_ChatCommands } from "@shared/types/MongoDB";
import ChatCommandEditor    from "@comp/chatCommands/ChatCommandEditor";
import { Accordion }        from "flowbite-react";
import ChatCommandElement   from "@comp/chatCommands/ChatCommandElement";
import {
	tRCP_handleError,
	tRPC_Guild
}                           from "@lib/tRPC";

interface ILoaderData {
	chatReactions : IMO_ChatCommands[];
}

const loader : LoaderFunction = async( { request, params } ) => {
	const { guildId } = params;
	const chatReactionsResult = await tRPC_Guild.chatcommands.getcommands.query( { guildId: guildId! } ).catch( tRCP_handleError );
	const chatReactions : IMO_ChatCommands[] = chatReactionsResult?.commands || [];

	return json<ILoaderData>( {
		chatReactions
	} );
};

const Component : FC = () => {
	const { chatReactions } = useLoaderData() as ILoaderData;

	return ( <>
		<ChatCommandEditor/>
		{ chatReactions.length > 0 && <Accordion>
			{ chatReactions.map( ( reaction ) => ( <ChatCommandElement key={ reaction._id } data={ reaction }/> ) ) }
		</Accordion> }
	</> );
};


export {
	Component,
	loader
};