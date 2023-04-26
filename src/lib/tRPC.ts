import {
	createTRPCProxyClient,
	httpBatchLink
} from "@trpc/client";
import type {
	AuthRouter,
	GuildRouter,
	PublicRouter
} from "@server/trpc/server";

export const tRPC_token = () => window.localStorage.getItem( "session" ) || "";

const tRPC_Public = createTRPCProxyClient<PublicRouter>( {
	links: [
		httpBatchLink( {
			url: "/api/v2/public",
			headers: () => {
				return {
					Authorization: `Bearer ${ tRPC_token() }`
				};
			}
		} )
	]
} );
const tRPC_Auth = createTRPCProxyClient<AuthRouter>( {
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
const tRPC_Guild = createTRPCProxyClient<GuildRouter>( {
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

export {
	tRPC_Public,
	tRPC_Auth,
	tRPC_Guild
};