/** @format */
import { ILang } from "../../Types/lang";

type ResponseBase<T = any> = {
	Success : boolean;
	Auth : boolean;
	Data? : T;
	Reached : boolean;
	MessageCode? : keyof ILang["ApiMessgaes"];
}

export type IAPIResponseBase<T = any> = ResponseBase<T>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TResponse_Auth_Vertify = IAPIResponseBase<>;
