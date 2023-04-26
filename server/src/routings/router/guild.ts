import { Response }  from "express";
import { EApiGuild } from "@shared/Enum/EApiPath";
import {
	DefaultResponseFailed,
	DefaultResponseSuccess
}                    from "@shared/Default/Auth.Default";
import {
	TR_Guild_Question_Checkout,
	TR_Guild_Question_Get
}                    from "@shared/types/API_Response";
import {
	ApiUrl,
	MW_Auth,
	MW_AuthGuild
}                    from "@server/lib/Express.Lib";
import {
	TERes,
	TEResG
}                    from "@server/types/express";
import DB_Guilds     from "@server/mongodb/DB_Guilds";

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
		} )
		.checkout( MW_AuthGuild, async( req : TEResG, res : Response ) => {
			try {
				return res.status( 200 ).json( {
					...DefaultResponseSuccess,
					Data: ( await req.body.guild.getGuildDb() )!,
					Auth: true
				} as TR_Guild_Question_Checkout );
			}
			catch ( e ) {
				if ( e instanceof Error ) {
					SystemLib.LogError( "api", e.message );
				}
			}

			return res.status( 500 ).json( {
				...DefaultResponseFailed
			} );
		} );
}
