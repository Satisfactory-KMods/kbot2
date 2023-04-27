import {
	createTRPCProxyClient,
	httpBatchLink,
	TRPCClientError
}                          from "@trpc/client";
import type {
	AuthRouter,
	GuildRouter,
	PublicRouter
}                          from "@server/trpc/server";
import { fireSwalFromApi } from "@lib/sweetAlert";

export const tRPC_token = () => window.localStorage.getItem( "session" ) || "";

export const tRPC_Public = createTRPCProxyClient<PublicRouter>( {
	links: [
		httpBatchLink( {
			url: "/api/v2/public"
		} )
	]
} );

export const tRPC_Auth = createTRPCProxyClient<AuthRouter>( {
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

export const tRCP_handleError = ( e : any ) => {
	if ( e instanceof TRPCClientError ) {
		fireSwalFromApi( e.message );
	}
};