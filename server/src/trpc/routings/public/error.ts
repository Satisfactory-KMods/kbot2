import type { tRPC } from "@server/trpc/server";
import { TRPCError } from "@trpc/server";


export const public_error = ( tRPC : tRPC ) => {
	return tRPC.procedure.query( async() => {
		throw new TRPCError( { code: "UNAUTHORIZED" } );
		console.log( "Hello World!" );
		return { message: "Hello World!" };
	} );
};