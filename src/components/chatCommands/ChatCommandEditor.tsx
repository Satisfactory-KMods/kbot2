import {
	MO_ChatCommands,
	ReactionMatchRule
}                           from "@shared/types/MongoDB";
import {
	FC,
	useEffect,
	useId,
	useRef,
	useState
}                           from "react";
import {
	Button,
	Label,
	Tabs,
	Textarea,
	TextInput,
	ToggleSwitch
}                           from "flowbite-react";
import {
	BiBot,
	BiMessage,
	BiPlus,
	BiSave,
	BiText,
	BiTrash
}                           from "react-icons/all";
import LoadButton           from "@comp/LoadButton";
import CreatableSelect      from "react-select/creatable";
import { MultiValue }       from "react-select";
import { useToggle }        from "@kyri123/k-reactutils";
import {
	tRPC_Guild,
	tRPC_handleError
}                           from "@lib/tRPC";
import { useParams }        from "react-router-dom";
import { messageTextLimit } from "@shared/Default/discord";
import {
	fireSwalFromApi,
	fireToastFromApi
}                           from "@lib/sweetAlert";
import ButtonGroup          from "flowbite-react/lib/esm/components/Button/ButtonGroup";

interface IChatCommandEditorProps {
	editData? : MO_ChatCommands;
	onUpdated? : ( command : MO_ChatCommands ) => void;
	onRemoved? : ( command : MO_ChatCommands ) => void;
}

const ChatCommandEditor : FC<IChatCommandEditorProps> = ( { editData, onUpdated, onRemoved } ) => {
	const { guildId } = useParams();
	const Id = useId();
	const [ onUpdate, updatePage ] = useToggle( false );
	const [ isLoading, setIsLoading ] = useState( false );

	const commandRef = useRef<HTMLInputElement>( null );
	const reactionTextRef = useRef<HTMLInputElement>( null );
	const [ aliasCommands, setAliasCommands ] = useState<MultiValue<{ label : string, value : string }>>( [] );
	const [ autoReactions, setAutoReactions ] = useState<ReactionMatchRule[]>( [] );
	const [ reactionText, setReactionText ] = useState<string>( "" );
	const [ similarity, setSimilarity ] = useState<boolean>( false );

	const buildData = () : Omit<MO_ChatCommands, "_id" | "__v" | "createdAt" | "updatedAt"> => {
		return {
			guildId: guildId!,
			command: commandRef.current!.value.toLowerCase(),
			alias: aliasCommands.map( e => e.value.toLowerCase() ),
			reactionText,
			autoReactionMatches: autoReactions
		};
	};

	const onSubmit = async() => {
		setIsLoading( true );
		if ( editData ) {
			const response = await tRPC_Guild.chatcommands.modify.mutate( {
				guildId: guildId!,
				data: buildData(),
				id: editData._id!
			} ).catch( tRPC_handleError );

			if ( response && response.command ) {
				fireToastFromApi( response.message, true );
				onUpdated && onUpdated( response.command );
			}
			if ( !response ) {
				setIsLoading( false );
				return;
			}
		}
		else {
			const response = await tRPC_Guild.chatcommands.add.mutate( {
				guildId: guildId!,
				data: buildData()
			} ).catch( tRPC_handleError );

			if ( response && response.command ) {
				fireToastFromApi( response.message, true );
				onUpdated && onUpdated( response.command );
			}
			if ( !response ) {
				setIsLoading( false );
				return;
			}
		}
		updatePage();
		setIsLoading( false );
	};

	const addReaction = () => {
		if ( reactionTextRef.current!.value ) {
			const matchString = reactionTextRef.current!.value;
			reactionTextRef.current!.value = "";
			const newElement = { matchString, similarity };

			setAutoReactions( curr => {
				return curr.concat( [ newElement ] );
			} );
			setSimilarity( () => true );
		}
	};

	const removeReaction = async( idx : number ) => {
		setAutoReactions( c => c.filter( ( e, i ) => i !== idx ) );
	};

	const removeCommand = async() => {
		if ( editData ) {
			const accept = await fireSwalFromApi( "Do you really want to remove this reaction?", false, {
				icon: "question",
				showConfirmButton: true,
				showCancelButton: true
			} );

			if ( accept?.isConfirmed ) {
				setIsLoading( true );
				const response = await tRPC_Guild.chatcommands.rm.mutate( {
					guildId: guildId!,
					id: editData._id!
				} ).catch( tRPC_handleError );

				if ( response && response.message ) {
					fireToastFromApi( response.message, true );
					if ( onRemoved ) {
						onRemoved( editData );
					}
				}
			}
			setIsLoading( false );
		}
	};

	useEffect( () => {
		commandRef.current && ( commandRef.current.value = editData?.command || "" );
		setReactionText( () => editData?.reactionText || "" );
		setAutoReactions( () => editData?.autoReactionMatches || [] );
		setAliasCommands( () => editData?.alias.map( A => ( { label: A, value: A } ) ) || [] );
		reactionTextRef.current!.value = "";
		setSimilarity( () => true );
	}, [ editData, onUpdate ] );

	return (
		<div>
			<Tabs.Group style="underline">
				<Tabs.Item active={ true } title="Dashboard" icon={ BiMessage }>
					<div className="mb-2 block">
						<Label htmlFor={ `${ Id }command` } value="Command"/>
					</div>
					<TextInput ref={ commandRef } id={ `${ Id }command` } type="text" sizing="md" className="mb-3"/>

					<div className="mb-2 block">
						<Label htmlFor={ `${ Id }aliascommand` } value="Command alias"/>
					</div>
					<CreatableSelect options={ [] } className="mt-2 my-react-select-container w-full"
					                 placeholder="Type a command alias and press enter"
					                 onCreateOption={ V => setAliasCommands( aliasCommands => aliasCommands.concat( [
						                 {
							                 label: V.toLowerCase(),
							                 value: V.toLowerCase()
						                 }
					                 ] ) ) }
					                 classNamePrefix="my-react-select" isMulti={ true } value={ aliasCommands }
					                 onChange={ setAliasCommands }/>

					<div className="mb-2 block">
						<Label htmlFor={ `${ Id }text` } value="Command text"/>
					</div>
					<Textarea onChange={ e => setReactionText( () => e.target.value ) } value={ reactionText }
					          color={ ( messageTextLimit - reactionText.length ) < 0 ? "failure" : undefined }
					          id={ `${ Id }text` }
					          helperText={ `Symbols left: ${ messageTextLimit - reactionText.length }` }
					          placeholder="chat response"
					          rows={ 6 }
					/>
				</Tabs.Item>
				<Tabs.Item active={ true } title="Auto Reactions" icon={ BiBot }>
					<div className="mb-2 block">
						<Label htmlFor={ `${ Id }reaction` } value="Reaction Text"/>
					</div>
					<TextInput ref={ reactionTextRef } id={ `${ Id }reaction` } type="text" sizing="md"
					           className="mb-3"/>

					<div className="mb-3 block">
						<ToggleSwitch label="Should react to text that matched like the text."
						              onChange={ setSimilarity }
						              checked={ similarity }/>
					</div>

					<div className="mb-2 block">
						<LoadButton size="xs" isLoading={ false } color="green" type="button"
						            onClick={ addReaction }
						            icon={ <BiPlus size={ 20 }/> }>Add</LoadButton>
					</div>

					{ !!autoReactions.length && <hr className="border-gray-600"/> }
					{ autoReactions.map( ( reaction, idx ) => {
						return (
							<div key={ `${ Id }${ idx }` }
							     className={ "mt-3 border border-gray-500 w-full flex rounded-lg" }>
								<div className="flex-grow-0 p-2">
									<div
										className={ `text-white p-2 px-4 pe-3 rounded-lg ${ reaction.similarity ? "bg-green-700" : "bg-red-700" }` }>
										<BiText size={ 22 }/>
									</div>
								</div>
								<div className="flex-1 text-white p-2 px-3">
									{ reaction.matchString }
								</div>
								<div className="flex-grow-0 p-2">
									<Button size="sm" color="red" className="rounded-0"
									        onClick={ () => removeReaction( idx ) }>
										<BiTrash size={ 20 }/>
									</Button>
								</div>
							</div>
						);
					} ) }
				</Tabs.Item>
			</Tabs.Group>
			<hr className="border-gray-600"/>
			<div className="p-3 rounded-b-lg">
				{ editData !== undefined ? ( <ButtonGroup>
					<LoadButton isLoading={ isLoading } color="green" type="button" onClick={ onSubmit }
					            icon={ <BiSave size={ 20 } className="me-2"/> }>Save</LoadButton>
					<LoadButton isLoading={ isLoading } color="red" type="button" onClick={ removeCommand }
					            icon={ <BiTrash size={ 20 } className="me-2"/> }>Remove</LoadButton>
				</ButtonGroup> ) : (
					<LoadButton isLoading={ isLoading } color="green" type="button" onClick={ onSubmit }
					            icon={ <BiSave size={ 20 } className="me-2"/> }>Save</LoadButton>
				) }
			</div>
		</div>
	);
};
export default ChatCommandEditor;
