import {
	fetchGetJson,
	useLocalStorage
}                           from "@kyri123/k-reactutils";
import { EApiAuth }         from "@shared/Enum/EApiPath";
import { ILoaderDataBase }  from "@app/types/routing";
import { IAPIResponseBase } from "@shared/types/API_Response";
import { useMemo }          from "react";
import { User }             from "@shared/class/User.Class";

// @return false if the user is not logged in
const validateLogin = async() : Promise<ILoaderDataBase> => {
	const sessionToken = window.localStorage.getItem( "session" );
	if ( sessionToken ) {
		const Response = await fetchGetJson<object, IAPIResponseBase>( {
			path: EApiAuth.validate,
			auth: sessionToken
		} ).catch( console.warn );
		if ( Response && Response.Auth ) {
			return { loggedIn: true };
		}
	}

	return { loggedIn: false };
};

const useAuth = () : [ User, () => void ] => {
	const { Storage, ResetStorage } = useLocalStorage( "session", "" );

	const Data = useMemo( () => new User( Storage ), [ Storage ] );

	return [ Data, ResetStorage ];
};

export default useAuth;
export {
	validateLogin
};