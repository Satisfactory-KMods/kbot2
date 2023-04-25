export enum EApiAuth {
	validate = "/api/v1/auth/validate",
	account = "/api/v1/auth/account",
}

export enum EApiGuild {
	question = "/api/v1/guild/question"
}

export type TApiPath = EApiAuth;
