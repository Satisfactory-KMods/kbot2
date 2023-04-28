import {
	FC,
	useState
}                           from "react";
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

const loader : LoaderFunction = async( { params } ) => {
	const { guildId } = params;
	const chatReactionsResult = await tRPC_Guild.chatcommands.getcommands.query( { guildId: guildId! } ).catch( tRCP_handleError );
	const chatReactions : IMO_ChatCommands[] = chatReactionsResult?.commands || [];

	return json<ILoaderData>( {
		chatReactions
	} );
};

const Component : FC = () => {
	const { chatReactions } = useLoaderData() as ILoaderData;
	const [ commands, setCommands ] = useState<IMO_ChatCommands[]>( () => chatReactions );

	const OnUpdateChatCommand = ( command : IMO_ChatCommands ) => {
		const commandIndex = commands.findIndex( e => e._id === command._id );
		if ( commandIndex >= 0 ) {
			setCommands( curr => {
				const next = [ ...curr ];
				next[ commandIndex ] = command;
				return next;
			} );
		}
		else {
			setCommands( curr => curr.concat( [ command ] ) );
		}
	};

	return ( <>
		<div
			className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col w-full p-0 mb-4">
			<div className="flex h-full flex-col justify-center gap-4 p-0">
				<div className="flex flex-col gap-2">
					<ChatCommandEditor onUpdated={ OnUpdateChatCommand }/>
				</div>
			</div>
		</div>
		{ commands.length > 0 && <Accordion>
			{ commands.map( ( reaction ) => (
				<ChatCommandElement onUpdated={ OnUpdateChatCommand } key={ reaction._id } data={ reaction }/> ) ) }
		</Accordion> }
	</> );
};


export {
	Component,
	loader
};