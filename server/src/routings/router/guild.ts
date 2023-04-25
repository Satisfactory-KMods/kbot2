import { Response }               from "express";
import { EApiGuild }              from "@shared/Enum/EApiPath";
import { DefaultResponseSuccess } from "@shared/Default/Auth.Default";
import { TR_Guild_Question_Get }  from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_Auth
}                                 from "@server/lib/Express.Lib";
import { TERes }                  from "@server/types/express";
import DB_Guilds                  from "@server/mongodb/DB_Guilds";

export default function() {
	Router.route( ApiUrl( EApiGuild.question ) )
		.get( MW_Auth, async( req : TERes, res : Response ) => {
			try {
				const guilds = await DB_Guilds.find( {
					isInGuild: true,
					accountIds: { $in: req.body.UserClass?.Get.discordId }
				} );
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					Data: guilds
				} as TR_Guild_Question_Get );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}

			return res.sendStatus( 500 );
		} );
}
