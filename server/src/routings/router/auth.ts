import {
	Request,
	Response
}                                 from "express";
import { EApiAuth }               from "@shared/Enum/EApiPath";
import { DefaultResponseSuccess } from "@shared/Default/Auth.Default";
import { TResponse_Auth_Vertify } from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_Auth
}                                 from "@server/lib/Express.Lib";

export default function () {
	Router.post( ApiUrl( EApiAuth.validate ), MW_Auth, ( req : Request, res : Response ) => {
		res.json( {
			...DefaultResponseSuccess,
			Auth: true
		} as TResponse_Auth_Vertify );
	} );
}
