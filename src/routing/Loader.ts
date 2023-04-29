import { LoaderDataBase } from "@app/types/routing";
import { validateLogin }  from "@hooks/useAuth";
import {
	tRCP_handleError,
	tRPC_Auth
}                         from "@lib/tRPC";
import { MO_Guild }       from "@shared/types/MongoDB";
import {
	json,
	LoaderFunction
}                         from "react-router-dom";


interface IndexLoaderData extends LoaderDataBase {
	guilds : MO_Guild[];
}

export const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( !result.loggedIn ) {
		window.location.replace( "/login" );
	}

	const guilds = ( await tRPC_Auth.getguilds.query().catch( tRCP_handleError ) )?.guilds || [] as MO_Guild[];

	return json<IndexLoaderData>( {
		...result,
		guilds
	} );
};