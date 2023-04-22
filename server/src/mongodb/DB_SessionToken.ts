import { IMO_UserAccountToken } from "@shared/types/MongoDB";
import * as mongoose            from "mongoose";

const UserAccountSchema = new mongoose.Schema<IMO_UserAccountToken>( {
	userid: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true }
}, { timestamps: true } );

export default mongoose.model<IMO_UserAccountToken>( "KBot2_UserAccountToken", UserAccountSchema );
export { UserAccountSchema };
