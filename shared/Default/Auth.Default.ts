import { IAPIResponseBase } from "@shared/types/API_Response";
import { IMO_UserAccount }  from "@shared/types/MongoDB";
import { ERoles }           from "@shared/Enum/ERoles";

export const DefaultUser : IMO_UserAccount = {
	discordId: "",
	guilds: [],
	_id: "",
	username: "Default User",
	role: ERoles.member
};

export const DefaultResponseFailed : IAPIResponseBase = {
	Data: undefined,
	Success: false,
	Auth: false,
	Reached: true,
	MessageCode: "Api.error.Failed"
};
 
export const DefaultResponseSuccess : IAPIResponseBase = {
	Data: undefined,
	Success: true,
	Auth: false,
	Reached: true
};
