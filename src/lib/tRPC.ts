import {
	createTRPCProxyClient,
	httpBatchLink
} from "@trpc/client";
import type {
	AuthRouter,
	GuildRouter,
	PublicRouter
} from "@server/trpc/server";

const tRPC_Public = createTRPCProxyClient<PublicRouter>( {
	links: [
		httpBatchLink( {
			url: "/api/v2/public"
		} )
	]
} );
const tRPC_Auth = createTRPCProxyClient<AuthRouter>( {
	links: [
		httpBatchLink( {
			url: "/api/v2/auth"
		} )
	]
} );
const tRPC_Guild = createTRPCProxyClient<GuildRouter>( {
	links: [
		httpBatchLink( {
			url: "/api/v2/guild"
		} )
	]
} );

export {
	tRPC_Public,
	tRPC_Auth,
	tRPC_Guild
};