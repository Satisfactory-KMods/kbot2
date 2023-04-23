import { User } from "@shared/class/User.Class";

export type RequestWithUser<T = any> = {
	UserClass? : T;
}

export type IRequestBody<T> = RequestWithUser<User> & Partial<T>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TRequest_Auth_Vertify = IRequestBody<{
	Token : string
}>;
