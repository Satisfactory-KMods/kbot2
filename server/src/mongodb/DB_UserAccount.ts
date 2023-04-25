import * as mongoose       from "mongoose";
import { Model }           from "mongoose";
import * as crypto         from "crypto";
import { IMO_UserAccount } from "@shared/types/MongoDB";

export interface IUserAccountMethods {
	setPassword : ( password : string ) => void;
	validPassword : ( password : string ) => boolean;
}

const UserAccountSchema = new mongoose.Schema<IMO_UserAccount>( {
	username: { type: String, required: true, unique: true },
	discordId: { type: String, required: true, unique: true },
	role: { type: Number, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true }
}, { timestamps: true } );

UserAccountSchema.methods.setPassword = function( password ) {
	this.salt = crypto.randomBytes( 16 + Math.ceil( Math.random() * 48 ) ).toString( "hex" );
	this.hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, "sha512" ).toString( "hex" );
};

UserAccountSchema.methods.validPassword = function( password ) {
	const hash = crypto.pbkdf2Sync( password, this.salt, 1000, 256, "sha512" ).toString( "hex" );
	return this.hash === hash;
};

const DB_UserAccount = mongoose.model<IMO_UserAccount, Model<IMO_UserAccount, any, IUserAccountMethods>>( "KBot2_UserAccount", UserAccountSchema );

const Revalidate = async() => {

};

export default DB_UserAccount;
export {
	UserAccountSchema,
	Revalidate
};