import { LoaderDataBase } from "@app/types/routing";
import { validateLogin }  from "@hooks/useAuth";
import {
	tRPC_Auth,
	tRPC_handleError
}                         from "@lib/tRPC";
import { MO_Guild }       from "@shared/types/MongoDB";
import {
	json,
	LoaderFunction,
	redirect
}                         from "react-router-dom";


export interface IndexLoaderData extends LoaderDataBase {
	guilds : MO_Guild[];
}

export const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( !result.loggedIn ) {
		return redirect( "/login" );
	}

	const guilds = ( await tRPC_Auth.getguilds.query().catch( tRPC_handleError ) )?.guilds || [] as MO_Guild[];

	return json<IndexLoaderData>( {
		...result,
		guilds
	} );
};