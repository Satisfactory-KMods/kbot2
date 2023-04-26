import { Response }         from "express";
import { EApiChatCommands } from "@shared/Enum/EApiPath";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                           from "@shared/Default/Auth.Default";
import {
	TR_Auth_Validate_All,
	TR_CC_Question_GET,
	TR_CC_Question_PUT
}                           from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_AuthGuild
}                           from "@server/lib/Express.Lib";
import { TEResG }           from "@server/types/express";
import {
	TReq_CC_Question_DELETE,
	TReq_CC_Question_GET,
	TReq_CC_Question_PATCH,
	TReq_CC_Question_PUT
}                           from "@shared/types/API_Request";
import DB_ChatCommands      from "@server/mongodb/DB_ChatCommands";

export default function() {
	Router.route( ApiUrl( EApiChatCommands.question ) )
		.get( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_GET>, res : Response ) => {
			try {
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					Data: await DB_ChatCommands.find( { guildId: req.body.guild.getGuild?.id } )
				} as TR_CC_Question_GET );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} )
		.put( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_PUT>, res : Response ) => {
			try {
				if ( !!req.body.command?.length && req.body.alias !== undefined && req.body.autoReactionMatches !== undefined && !!req.body.reactionText?.length ) {
					DB_ChatCommands;
				}
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					MessageCode: "cc.invalid"
				} as TR_CC_Question_PUT );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}
			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} as TR_Auth_Validate_All );
		} )
		.patch( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_PATCH>, res : Response ) => {

		} )
		.delete( MW_AuthGuild, async( req : TEResG<TReq_CC_Question_DELETE>, res : Response ) => {

		} );
}
