import { IMO_RegisterToken } from "@shared/types/MongoDB";
import * as mongoose         from "mongoose";

const RegisterTokenSchema = new mongoose.Schema<IMO_RegisterToken>( {
	userId: { type: String, required: true },
	guildId: { type: String, required: true },
	token: { type: String, required: true },
	expire: { type: Date, required: true },
	isPasswordResetToken: { type: Boolean, required: true }
} );

const DB_RegisterToken = mongoose.model<IMO_RegisterToken>( "KBot2_RegisterToken", RegisterTokenSchema );

const Revalidate = async() => {

};

export default DB_RegisterToken;
export {
	RegisterTokenSchema,
	Revalidate
};