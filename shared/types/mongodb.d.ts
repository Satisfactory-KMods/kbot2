import { ERoles } from "@shared/Enum/ERoles";

export interface IMongoDB {
	_id? : string,
	__v? : number,
	createdAt? : Date | string, // string on client side
	updatedAt? : Date | string // string on client side
}

export interface IMO_UserAccount extends IMongoDB {
	username : string,
	hash? : string,
	salt? : string,
	email : string,
	role : ERoles
}

export interface IMO_UserAccountToken extends IMongoDB {
	userid : string,
	token : string,
	expire : Date
}
