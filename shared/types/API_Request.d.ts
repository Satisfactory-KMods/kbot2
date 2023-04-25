import { User } from "@shared/class/User.Class";

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

export type IRequestBody<T> = RequestWithUser<User> & Partial<T>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TReq_Auth_Account_Checkout = IRequestBody<ILoginRequest>;
export type TReq_Auth_Account_Put = IRequestBody<Omit<IRegisterRequest, "stayLoggedIn">>;
export type TReq_Auth_Modify_Patch = IRequestBody<Omit<IRegisterRequest, "stayLoggedIn", "username">>;
