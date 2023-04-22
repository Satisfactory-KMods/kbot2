import { IAPIResponseBase } from "@shared/types/API_Response";
import { IMO_UserAccount }  from "@shared/types/MongoDB";
import { ERoles }           from "@shared/Enum/ERoles";

export const DefaultUser : IMO_UserAccount = {
	__v: 0,
	_id: "123123",
	username: "Default User",
	email: "ychag@example.com",
	role: ERoles.member
};

export const DefaultResponseFailed : IAPIResponseBase = {
	Success: false,
	Auth: false,
	Reached: true,
	MessageCode: "Api.error.Failed"
};

export const DefaultResponseSuccess : IAPIResponseBase = {
	Success: true,
	Auth: false,
	Reached: true
};
