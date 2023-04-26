import { User }             from "@shared/class/User.Class";
import { IMO_ChatCommands } from "@shared/types/MongoDB";

export interface ILoginRequest {
	username : string;
	password : string;
	stayLoggedIn : boolean;
}

export interface IRegisterRequest extends ILoginRequest {
	passwordAgain : string;
	token : string;
}

export type RequestWithUser<T = any> = {
	UserClass? : T;
}

export type IRequestBody<T = any> = RequestWithUser<User> & Partial<T>;
export type IRequestGuildBody<T = any> = RequestWithUser<User> & Partial<T> & { guildId : string };

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TReq_Auth_Account_Checkout = IRequestBody<ILoginRequest>;
export type TReq_Auth_Account_Put = IRequestBody<Omit<IRegisterRequest, "stayLoggedIn">>;
export type TReq_Auth_Modify_Patch = IRequestBody<Omit<IRegisterRequest, "stayLoggedIn" | "username">>;

// ------------------------------------------------
// ----------------- ChatCommands -----------------
// ------------------------------------------------

export type TReq_CC_Question_GET = IRequestGuildBody;
export type TReq_CC_Question_PUT = IRequestGuildBody<Pick<IMO_ChatCommands, "autoReactionMatches" | "reactionText" | "alias" | "command">>;
export type TReq_CC_Question_PATCH = IRequestGuildBody<Pick<IMO_ChatCommands, "_id" | "autoReactionMatches" | "reactionText" | "alias" | "command">>;
export type TReq_CC_Question_DELETE = IRequestGuildBody<Pick<IMO_ChatCommands, "_id">>;

