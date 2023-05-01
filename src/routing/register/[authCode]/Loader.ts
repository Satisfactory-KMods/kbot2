import {
	json,
	LoaderFunction,
	redirect
}                         from "react-router-dom";
import { validateLogin }  from "@hooks/useAuth";
import { LoaderDataBase } from "@app/types/routing";
import {
	tRCP_handleError,
	tRPC_Public
}                         from "@lib/tRPC";
import { EApiTokenType }  from "@shared/Enum/EApiMethods";

export interface RegisterLoaderData extends LoaderDataBase {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { authCode } = params;
	const result = await validateLogin();

	const Response = await tRPC_Public.checktoken.mutate( {
		token: authCode!,
		type: EApiTokenType.reg
	} ).catch( tRCP_handleError );

	const tokenValid = !!Response?.valid;
	if ( !tokenValid ) {
		return redirect( "/error/401" );
	}

	return json<RegisterLoaderData>( { tokenValid, ...result } );
};

export {
	loader
};
