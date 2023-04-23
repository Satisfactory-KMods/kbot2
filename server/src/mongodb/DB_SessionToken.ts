import { IMO_UserAccountToken } from "@shared/types/MongoDB";
import * as mongoose            from "mongoose";

const UserAccountSchema = new mongoose.Schema<IMO_UserAccountToken>( {
	userid: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true }
}, { timestamps: true } );

const DB_SessionToken = mongoose.model<IMO_UserAccountToken>( "KBot2_UserAccountToken", UserAccountSchema );

const Revalidate = async() => {

};

export default DB_SessionToken;
export {
	UserAccountSchema,
	Revalidate
};