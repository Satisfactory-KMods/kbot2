import {
	FC,
	useId,
	useState
}                                  from "react";
import { useParams }               from "react-router-dom";
import useGuild                    from "@hooks/useGuild";
import { channelToSelectedSingle } from "@lib/selectConversion";
import {
	Label,
	TextInput
}                                  from "flowbite-react";
import Select                      from "react-select";
import LoadButton                  from "@comp/LoadButton";
import {
	BiPlus,
	BiSave
}                                  from "react-icons/all";
import useSelection                from "@hooks/useSelection";
import {
	MO_ReactionRoleMap,
	MO_ReactionRoles
}                                  from "@shared/types/MongoDB";
import ReactionRoleEditorRuleRow   from "@comp/reactionRoles/ReactionRoleEditorRuleRow";
import _                           from "lodash";
import {
	tRPC_Guild,
	tRPC_handleError
}                                  from "@lib/tRPC";
import { fireToastFromApi }        from "@lib/sweetAlert";

export interface ReactionRoleEditorProps {
	modifyData? : MO_ReactionRoles;
	onUpdate? : () => void;
}

const ReactionRoleEditor : FC<ReactionRoleEditorProps> = ( { modifyData, onUpdate } ) => {
	const { textChannelOptions } = useSelection();
	const { guildId } = useParams();
	const Id = useId();
	const [ isLoading, setIsLoading ] = useState( false );

	const { textChannels } = useGuild();

	const [ channelId, setChannelId ] = useState( () => channelToSelectedSingle( textChannels, modifyData?.channelId || "" ) );
	const [ reactions, setReactions ] = useState( () => modifyData?.reactions || [] );
	const [ messageId, setMessageId ] = useState( () => modifyData?.messageId || "" );

	const addReaction = () => {
		setReactions( curr => curr.concat( {
			emoji: "",
			roleIds: []
		} ) );
	};

	const removeReaction = ( idx : number ) => {
		setReactions( c => c.filter( ( e, i ) => i !== idx ) );
	};

	const updateReaction = ( idx : number, value : MO_ReactionRoleMap ) => {
		setReactions( curr => {
			const newValue = _.cloneDeep( curr );
			newValue.splice( idx, 1, value );
			return newValue;
		} );
	};

	const Build = ( remove? : boolean ) => ( {
		guildId: guildId!,
		id: modifyData ? modifyData._id : undefined,
		remove: !!remove,
		data: {
			channelId: channelId?.value || "",
			messageId,
			reactions: reactions.filter( e => e.roleIds.length > 0 )
		}
	} );

	const saveSettings = async( remove? : boolean ) => {
		setIsLoading( true );

		const response = await tRPC_Guild.reactionroles.modifyReactionRole.mutate( Build( remove ) ).catch( tRPC_handleError );

		setIsLoading( false );
		if ( response && response.message ) {
			if ( !modifyData ) {
				setMessageId( "" );
				setReactions( [] );
				setChannelId( null );
			}
			fireToastFromApi( response.message, true );
			if ( onUpdate ) {
				await onUpdate();
			}
		}
	};

	return (
		<>
			<div className="mb-3 block">
				<Label value="Channel of the message"/>
			</div>
			<Select options={ textChannelOptions }
			        className="mt-2 mb-3 my-react-select-container w-full"
			        isClearable={ true }
			        classNamePrefix="my-react-select" isMulti={ false }
			        value={ channelId }
			        onChange={ setChannelId }/>

			<div className="mb-3 block">
				<Label value="Message channel id"/>
			</div>
			<TextInput className="mt-2 mb-3" type="number" value={ messageId }
			           helperText="Tip: you can find the message id on right click the message."
			           onChange={ e => setMessageId( e.target.value.toString() ) }/>

			<div className="mb-2 block">
				<LoadButton size="xs" isLoading={ false } color="green" type="button"
				            onClick={ addReaction }
				            icon={ <BiPlus size={ 20 }/> }>Add Reaction</LoadButton>
			</div>

			{ !!reactions.length && <hr className="border-gray-600"/> }
			{ reactions.map( ( reaction, idx ) => {
				return (
					<ReactionRoleEditorRuleRow key={ Id + idx } map={ reaction } isEditing={ modifyData !== undefined }
					                           onRuleChange={ value => updateReaction( idx, value ) }
					                           onRuleDelete={ () => removeReaction( idx ) }/>
				);
			} ) }

			<hr className="border-gray-600 mt-3"/>
			<div className="p-3 rounded-b-lg">
				<LoadButton isLoading={ isLoading } color="green" type="button"
				            onClick={ () => saveSettings() }
				            icon={ <BiSave size={ 20 }
				                           className="me-2"/> }>Save</LoadButton>
			</div>
		</>
	);
};

export default ReactionRoleEditor;
