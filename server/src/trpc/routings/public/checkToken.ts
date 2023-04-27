import type { tRPC }     from "@server/trpc/server";
import { z }             from "zod";
import { TRPCError }     from "@trpc/server";
import { EApiTokenType } from "@shared/Enum/EApiMethods";
import { handleTRCPErr } from "@server/lib/Express.Lib";
import DB_RegisterToken  from "@server/mongodb/DB_RegisterToken";

export const public_checkToken = ( tRPC : tRPC ) => {
	return tRPC.procedure.input( z.object( {
		token: z.string().min( 20, { message: "Token is to short!" } ),
		type: z.nativeEnum( EApiTokenType )
	} ) ).mutation<{
		valid : boolean
	}>( async( { input } ) => {
		const { token, type } = input;
		try {
			return {
				valid: !!( await DB_RegisterToken.exists( {
					token,
					isPasswordResetToken: ( type === EApiTokenType.reset ),
					expire: { $gte: new Date() }
				} ) )
			};
		}
		catch ( e ) {
			handleTRCPErr( e );
		}
		throw new TRPCError( { code: "BAD_REQUEST" } );
	} );
};