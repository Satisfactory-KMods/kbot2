/** @format */
import { IMO_Guild } from "@shared/types/MongoDB";

type ResponseBase<T = any> = {
	Success : boolean;
	Auth : boolean;
	Data : T;
	Reached : boolean;
	MessageCode? : string;
}

export type IAPIResponseBase<T = any> = ResponseBase<T>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TR_Auth_Validate_All = IAPIResponseBase;
export type TR_Auth_Account_Checkout = IAPIResponseBase<{ token : string }>;
export type TR_Auth_Account_Put = TR_Auth_Account_Checkout;
export type TR_Auth_Modify_Patch = TR_Auth_Account_Checkout;

// -----------------------------------------
// ----------------- Guild -----------------
// -----------------------------------------

export type TR_Guild_Question_Get = IAPIResponseBase<IMO_Guild[]>;
