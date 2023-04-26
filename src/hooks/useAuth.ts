import {
	fetchCheckoutJson,
	fetchGetJson,
	IQueryOptions,
	useLocalStorage
}                            from "@kyri123/k-reactutils";
import {
	EApiAuth,
	EApiGuild
}                            from "@shared/Enum/EApiPath";
import {
	ILoaderDataBase,
	ILoaderGuild
}                            from "@app/types/routing";
import {
	IAPIResponseBase,
	TR_Guild_Question_Checkout
}                            from "@shared/types/API_Response";
import { useMemo }           from "react";
import { User }              from "@shared/class/User.Class";
import { IRequestGuildBody } from "@shared/types/API_Request";
import { Params }            from "react-router-dom";

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

const validateLoginWithGuild = async( guildId : string ) : Promise<ILoaderGuild> => {
	const sessionToken = window.localStorage.getItem( "session" );
	if ( sessionToken ) {
		const Response = await fetchCheckoutJson<IRequestGuildBody, TR_Guild_Question_Checkout>( {
			path: EApiGuild.question,
			auth: sessionToken,
			data: {
				guildId
			}
		} ).catch( console.warn );

		if ( Response && Response.Auth && Response.Data ) {
			return { loggedIn: true, guildData: Response.Data };
		}
	}

	return { loggedIn: false, guildData: null };
};


function getGuildRequest<D extends IRequestGuildBody = IRequestGuildBody>( params : Params<string>, data : Omit<D, "guildId"> ) : Omit<IQueryOptions<D>, "method"> {
	const { guildId } = params;
	const sessionToken = window.localStorage.getItem( "session" );
	return {
		path: EApiGuild.question,
		auth: sessionToken || undefined,
		data: {
			guildId,
			...data
		} as any
	};
}

const getToken = () : string => {
	return window.localStorage.getItem( "session" ) || "";
};

export type TUseAuth = [ User, () => void, ( newToken : string ) => void ]

const useAuth = () : TUseAuth => {
	const { Storage, ResetStorage, SetStorage } = useLocalStorage( "session", "" );

	const Data = useMemo( () => new User( Storage ), [ Storage ] );

	const Logout = () => {
		ResetStorage();
		window.location.replace( "/login" );
	};

	return [ Data, Logout, SetStorage ];
};

export default useAuth;
export {
	getToken,
	validateLogin,
	validateLoginWithGuild
};