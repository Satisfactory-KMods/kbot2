/** @format */

type ResponseBase<T = any> = {
	Success : boolean;
	Auth : boolean;
	Data? : T;
	Reached : boolean;
	MessageCode? : string;
}

export type IAPIResponseBase<T = any> = ResponseBase<T>;

// ----------------------------------------
// ----------------- Auth -----------------
// ----------------------------------------

export type TResponse_Auth_Vertify = IAPIResponseBase<>;
