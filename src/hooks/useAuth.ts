import {
	IQueryOptions,
	useLocalStorage
}                            from "@kyri123/k-reactutils";
import { EApiGuild }         from "@shared/Enum/EApiPath";
import {
	ILoaderDataBase,
	ILoaderGuild
}                            from "@app/types/routing";
import { useMemo }           from "react";
import { User }              from "@shared/class/User.Class";
import { IRequestGuildBody } from "@shared/types/API_Request";
import { Params }            from "react-router-dom";
import {
	tRPC_Guild,
	tRPC_Public
}                            from "@lib/tRPC";

// @return false if the user is not logged in
const validateLogin = async() : Promise<ILoaderDataBase> => {
	const token = window.localStorage.getItem( "session" ) || "";
	const Response = await tRPC_Public.validate.query( { token } ).catch( console.warn );

	const loggedIn = !!Response?.tokenValid;
	if ( !loggedIn ) {
		window.localStorage.setItem( "session", "" );
	}

	return { loggedIn };
};

const validateLoginWithGuild = async( guildId : string ) : Promise<ILoaderGuild> => {
	const Response = await tRPC_Guild.validate.query( { guildId } ).catch( console.warn );

	if ( !Response ) {
		return { loggedIn: false, guildData: undefined };
	}

	return { loggedIn: Response?.tokenValid, guildData: undefined, ...Response };
};


function getGuildRequest<D extends IRequestGuildBody = IRequestGuildBody>( params : Params<string>, data? : Omit<D, "guildId"> ) : Omit<IQueryOptions<D>, "method"> {
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
		window.location.href = "/login";
	};

	return [ Data, Logout, SetStorage ];
};

export default useAuth;
export {
	getGuildRequest,
	getToken,
	validateLogin,
	validateLoginWithGuild
};