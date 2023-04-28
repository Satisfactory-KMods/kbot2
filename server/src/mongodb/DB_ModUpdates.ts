import { MO_ModUpdate } from "@shared/types/MongoDB";
import * as mongoose    from "mongoose";

const ModUpdatesSchema = new mongoose.Schema<MO_ModUpdate>( {
	modRef: { type: String, required: true },
	hash: { type: String, required: true },
	guildId: { type: String, required: true },
	lastUpdate: { type: Date, required: true },
	lastMessageId: { type: String, required: true }
}, { timestamps: true } );

const DB_ModUpdates = mongoose.model<MO_ModUpdate>( "KBot2_ModUpdates", ModUpdatesSchema );

const Revalidate = async() => {

};

export default DB_ModUpdates;
export {
	ModUpdatesSchema,
	Revalidate
};