import * as mongoose from "mongoose";
import { IMO_Guild } from "@shared/types/MongoDB";

const GuildSchema = new mongoose.Schema<IMO_Guild>( {
	guildId: { type: String, required: true, unique: true },
	guildName: { type: String, required: true },
	accountIds: { type: [ String ], default: [] }
}, { timestamps: true } );

export default mongoose.model<IMO_Guild>( "KBot2_Guilds", GuildSchema );
export { GuildSchema };
