import {
	Request,
	Response
}                                 from "express";
import { EApiAuth }               from "@shared/Enum/EApiPath";
import { DefaultResponseSuccess } from "@shared/Default/Auth.Default";
import { TR_Auth_Validate_All }   from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_Auth
}                                 from "@server/lib/Express.Lib";
import DB_RegisterToken           from "@server/mongodb/DB_RegisterToken";
import * as core                  from "express-serve-static-core";

export default function() {
	Router.route( ApiUrl( EApiAuth.validate ) )
		.get( MW_Auth, ( req : Request, res : Response ) => {
			res.json( {
				...DefaultResponseSuccess,
				Auth: true
			} as TR_Auth_Validate_All );
		} )
		.checkout( async( req : Request<core.ParamsDictionary, any, { authcode : string }>, res : Response ) => {
			try {
				res.json( {
					...DefaultResponseSuccess,
					tokenOk: await DB_RegisterToken.findOne( {
						expire: { $gte: new Date() },
						token: req.body.authcode
					} ) !== null
				} as TR_Auth_Validate_All );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", "Error by reading RegisterToken:", e.message );
				}
			}
		} );
}
