import {
	FC,
	useContext,
	useState
}                                   from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                                   from "react-router-dom";
import { IMO_ChatCommands }         from "@shared/types/MongoDB";
import ChatCommandEditor            from "@comp/chatCommands/ChatCommandEditor";
import { Accordion }                from "flowbite-react";
import {
	tRCP_handleError,
	tRPC_Guild
}                                   from "@lib/tRPC";
import { HiOutlineArrowCircleDown } from "react-icons/all";
import guildContext                 from "@context/guildContext";

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
	const { options } = useContext( guildContext );
	const { chatReactions } = useLoaderData() as ILoaderData;
	const [ commands, setCommands ] = useState<IMO_ChatCommands[]>( () => chatReactions );

	const OnUpdateChatCommand = ( command : IMO_ChatCommands ) => {
		const commandIndex = commands.findIndex( e => e._id === command._id );
		if ( commandIndex >= 0 ) {
			const next = [ ...commands ];
			next[ commandIndex ] = command;
			setCommands( next );
		}
		else {
			setCommands( commands.concat( [ command ] ) );
		}
	};

	const OnRemoveChatCommand = ( command : IMO_ChatCommands ) => {
		setCommands( c => c.filter( e => e._id !== command._id ) );
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
		{ commands.length > 0 && <Accordion collapseAll={ true } arrowIcon={ HiOutlineArrowCircleDown }>
			{ commands.map( ( reaction ) => (
				<Accordion.Panel key={ reaction._id }>
					<Accordion.Title>
						{ options.chatCommandPrefix }{ reaction.command }
					</Accordion.Title>
					<Accordion.Content>
						<ChatCommandEditor onUpdated={ OnUpdateChatCommand } onRemoved={ OnRemoveChatCommand }
						                   editData={ reaction }/>
					</Accordion.Content>
				</Accordion.Panel>
			) ) }
		</Accordion> }
	</> );
};


export {
	Component,
	loader
};