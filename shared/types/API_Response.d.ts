/** @format */

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
export type TR_Auth_Account_Post = IAPIResponseBase<{ token : string }>;
