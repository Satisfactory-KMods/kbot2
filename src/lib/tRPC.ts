import {
	createTRPCProxyClient,
	httpBatchLink,
	TRPCClientError
}                from "@trpc/client";
import type {
	AuthRouter,
	GuildRouter,
	PublicRouter
}                from "@server/trpc/server";
import {
	fireSwalFromApi,
	fireToastFromApi
}                from "@lib/sweetAlert";
import superjson from "superjson";

export const tRPC_token = () => window.localStorage.getItem( "session" ) || "";

export const tRPC_Public = createTRPCProxyClient<PublicRouter>( {
	transformer: superjson,
	links: [
		httpBatchLink( {
			url: "/api/v2/public"
		} )
	]
} );

export const tRPC_Auth = createTRPCProxyClient<AuthRouter>( {
	transformer: superjson,
	links: [
		httpBatchLink( {
			url: "/api/v2/auth",
			headers: () => {
				return {
					Authorization: `Bearer ${ tRPC_token() }`
				};
			}
		} )
	]
} );

export const tRPC_Guild = createTRPCProxyClient<GuildRouter>( {
	transformer: superjson,
	links: [
		httpBatchLink( {
			url: "/api/v2/guild",
			headers: () => {
				return {
					Authorization: `Bearer ${ tRPC_token() }`
				};
			}
		} )
	]
} );

export const tRCP_handleError = ( e : any, asToast? : boolean ) => {
	if ( e instanceof TRPCClientError ) {
		let message : string | string[] = e.message;
		try {
			const asArray : any[] = JSON.parse( e.message );
			message = asArray.map( msg => msg.message );
		}
		catch ( err ) {
		}

		if ( !asToast ) {
			fireSwalFromApi( message );
		}
		else {
			fireToastFromApi( message );
		}
	}
};