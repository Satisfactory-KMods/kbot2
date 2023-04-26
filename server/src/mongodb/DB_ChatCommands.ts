import { IMO_ChatCommands } from "@shared/types/MongoDB";
import * as mongoose        from "mongoose";

const ChatCommandsSchema = new mongoose.Schema<IMO_ChatCommands>( {
	guildId: { type: String, required: true },
	command: { type: String, required: true },
	alias: { type: [ String ], required: true, default: [] },
	reactionText: { type: String, required: true },
	autoReactionMatches: {
		type: [
			{
				matchString: { type: String, required: true },
				similarity: { type: Boolean, required: true }
			}
		], required: true, default: []
	}
} );

const DB_ChatCommands = mongoose.model<IMO_ChatCommands>( "KBot2_ChatCommands", ChatCommandsSchema );

const Revalidate = async() => {

};

export default DB_ChatCommands;
export {
	ChatCommandsSchema,
	Revalidate
};