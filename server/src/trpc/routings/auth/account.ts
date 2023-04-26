import type { tRPC } from "@server/trpc/server";


export const auth_login = ( tRPC : tRPC ) => {
	return tRPC.procedure.query( async() => {
		console.log( "Hello World!" );
		return { message: "Hello World!" };
	} );
};