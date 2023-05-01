import {
	FC,
	useContext,
	useRef,
	useState
}                                  from "react";
import { useLoaderData }           from "react-router-dom";
import { MO_ChatCommands }         from "@shared/types/MongoDB";
import ChatCommandEditor           from "@comp/chatCommands/ChatCommandEditor";
import {
	Accordion,
	TextInput
}                                  from "flowbite-react";
import {
	tRCP_handleError,
	tRPC_Guild
}                                  from "@lib/tRPC";
import {
	BiSave,
	HiOutlineArrowCircleDown
}                                  from "react-icons/all";
import GuildContext                from "@context/GuildContext";
import LoadButton                  from "@comp/LoadButton";
import { fireToastFromApi }        from "@lib/sweetAlert";
import { GuildCommandsLoaderData } from "@guild/chatcommands/Loader";

const Component : FC = () => {
	const { guildData, triggerGuildUpdate } = useContext( GuildContext );
	const { chatReactions } = useLoaderData() as GuildCommandsLoaderData;
	const [ commands, setCommands ] = useState<MO_ChatCommands[]>( () => chatReactions );
	const prefixInputRef = useRef<HTMLInputElement>( null );
	const [ isEditing, setIsEditing ] = useState<boolean>( false );

	const OnUpdateChatCommand = ( command : MO_ChatCommands ) => {
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

	const OnRemoveChatCommand = ( command : MO_ChatCommands ) => {
		setCommands( c => c.filter( e => e._id !== command._id ) );
	};

	const onSetPrefix = async() => {
		setIsEditing( true );
		const response = await tRPC_Guild.chatcommands.setprefix.mutate( {
			guildId: guildData.guildId,
			prefix: prefixInputRef.current?.value || "."
		} ).catch( tRCP_handleError );

		if ( response && response.message ) {
			fireToastFromApi( response.message, true );
			await triggerGuildUpdate();
		}
		setIsEditing( false );
	};

	return ( <>
		<div
			className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col w-full p-0 mb-4">
			<div className="flex h-full flex-col justify-center gap-4 p-0">
				<div className="flex gap-2 p-2">
					<div className="border bg-gray-700 p-2 px-3 text-slate-200 rounded-lg border-gray-600">
						Command Prefix
					</div>
					<TextInput type="text" className={ "flex-1" } onChange={ () => {
					} } defaultValue={ guildData.options.chatCommandPrefix } ref={ prefixInputRef }/>
					<LoadButton isLoading={ isEditing } color="green" onClick={ onSetPrefix } icon={ <BiSave
						size={ 20 }/> }/>
				</div>
			</div>
		</div>
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
						{ guildData.options.chatCommandPrefix }{ reaction.command }
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
	Component
};