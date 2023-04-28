import { IMO_ChatCommands } from "@shared/types/MongoDB";
import { FC }               from "react";
import ChatCommandEditor    from "@comp/chatCommands/ChatCommandEditor";

interface IChatCommandElementProps {
	data : IMO_ChatCommands;
	onUpdated? : ( command : IMO_ChatCommands ) => void;
}

const ChatCommandElement : FC<IChatCommandElementProps> = ( { data, onUpdated } ) => {

	return (
		<>
			<ChatCommandEditor onUpdated={ onUpdated } editData={ data }/>
		</>
	);
};

export default ChatCommandElement;
