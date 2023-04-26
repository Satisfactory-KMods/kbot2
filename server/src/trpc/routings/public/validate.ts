import type { tRPC }   from "@server/trpc/server";
import { z }           from "zod";
import * as jwt        from "jsonwebtoken";
import DB_SessionToken from "@server/mongodb/DB_SessionToken";

export const public_validate = ( tRPC : tRPC ) => {
	return tRPC.procedure
		.input( z.object( {
			token: z.string()
		} ) ).query<{
			tokenValid : boolean;
		}>( async( { input } ) => {
			try {
				await jwt.verify( input.token, process.env.JWTToken || "" );
				return { tokenValid: !!( await DB_SessionToken.exists( { token: input.token } ) ) };
			}
			catch ( e ) {
			}
			return { tokenValid: false };
		} );
};