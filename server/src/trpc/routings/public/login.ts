import type { tRPC } from "@server/trpc/server";
import { z }         from "zod";

export const public_login = ( tRPC : tRPC ) => {
	return tRPC.procedure
		.input( z.object( {
			login: z.string(),
			password: z.string()
		} ) ).query<{
			token : string;
		}>( async( { input } ) => {
			try {
				return { token: "true" };
			}
			catch ( e ) {
				// err
			}
			return { token: "false" };
		} );
};