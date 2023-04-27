import type { tRPC }     from "@server/trpc/server";
import { IMO_Guild }     from "@shared/types/MongoDB";
import { TRPCError }     from "@trpc/server";
import DB_Guilds         from "@server/mongodb/DB_Guilds";
import { handleTRCPErr } from "@server/lib/Express.Lib";

export const auth_getGuilds = ( tRPC : tRPC ) => {
	return tRPC.procedure.query<{
		guilds : IMO_Guild[];
	}>( async( { ctx } ) => {
		const { userClass } = ctx;
		try {
			if ( userClass?.IsValid ) {
				const guilds = await DB_Guilds.find( {
					accountIds: { $in: userClass.Get.discordId }
				} );
				return { guilds };
			}
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { message: "Something goes wrong!", code: "INTERNAL_SERVER_ERROR" } );
	} );
};