import { IMO_ChatCommands } from "@shared/types/MongoDB";
import { FC }               from "react";
import { Card }             from "flowbite-react";

interface IChatCommandEditorProps {
	editData? : IMO_ChatCommands;
}

const ChatCommandEditor : FC<IChatCommandEditorProps> = ( { editData } ) => {

	return (
		<Card className="w-full">
		</Card>
	);
};

export default ChatCommandEditor;
