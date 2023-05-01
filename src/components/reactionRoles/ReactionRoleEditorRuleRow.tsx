import {
	FC,
	useEffect,
	useState
}                             from "react";
import useGuild               from "@hooks/useGuild";
import {
	OptionSelection,
	roleToSelectedMulti
}                             from "@lib/selectConversion";
import useSelection           from "@hooks/useSelection";
import { MO_ReactionRoleMap } from "@shared/types/MongoDB";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useToggle }          from "@kyri123/k-reactutils";
import {
	Button,
	Modal
}                             from "flowbite-react";
import { BiTrash }            from "react-icons/all";
import Select, { MultiValue } from "react-select";
import SaveModal              from "@comp/SaveModal";

export interface ReactionRoleEditorRuleRowProps {
	isEditing? : boolean;
	map : MO_ReactionRoleMap;
	onRuleChange : ( map : MO_ReactionRoleMap ) => void;
	onRuleDelete : () => void;
}

const ReactionRoleEditorRuleRow : FC<ReactionRoleEditorRuleRowProps> = ( {
	map,
	onRuleChange,
	onRuleDelete,
	isEditing
} ) => {
	const { roles } = useGuild();
	const { roleOptions } = useSelection();
	const [ selectEmoji, toggleSelectEmoji ] = useToggle( false );

	const [ selectedRole, setSelectedRole ] = useState<MultiValue<OptionSelection<string>>>( () => roleToSelectedMulti( roles, map.roleIds ) || [ roleOptions[ 1 ] ] || null );
	const [ emoji, setEmoji ] = useState( () => map.emoji );

	useEffect( () => {
		onRuleChange( { emoji, roleIds: selectedRole.map( e => e.value ) || "" } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ emoji, selectedRole ] );

	return (
		<>
			<div className={ "mt-3 border border-gray-500 w-full flex rounded-lg" }>
				<div className="flex-1 p-2">
					<Select options={ roleOptions.filter( e => !e.label?.includes( "@everyone" ) ) }
					        className="my-react-select-container w-full"
					        classNamePrefix="my-react-select" isMulti={ true } value={ selectedRole }
					        onChange={ setSelectedRole }/>
				</div>
				<div className="flex-grow-0 text-white p-2 px-3">
					<Button onClick={ toggleSelectEmoji } color="gray">{ emoji }</Button>
				</div>
				<div className="flex-grow-0 p-2">
					<Button color="red" className="rounded-0"
					        onClick={ onRuleDelete }>
						<BiTrash size={ 20 }/>
					</Button>
				</div>
			</div>

			<SaveModal dismissible={ emoji !== "" } position={ "center" } show={ selectEmoji || emoji === "" }
			           onClose={ toggleSelectEmoji }>
				<Modal.Header>
					Select Emoji
				</Modal.Header>
				<Modal.Body className="pt-6">
					<EmojiPicker lazyLoadEmojis={ true } theme={ Theme.DARK } onEmojiClick={ emoji => {
						toggleSelectEmoji();
						setEmoji( emoji.emoji );
					} } width={ "100%" }/>
				</Modal.Body>
			</SaveModal>
		</>
	);
};

export default ReactionRoleEditorRuleRow;
