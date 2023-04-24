import { fetchGetJson }    from "@kyri123/k-reactutils";
import { EApiAuth }        from "@shared/Enum/EApiPath";
import { ILoaderDataBase } from "@app/types/routing";

// @return false if the user is not logged in
const validateLogin = async() : Promise<ILoaderDataBase> => {
	const sessionToken = window.localStorage.getItem( "session" );
	if ( sessionToken ) {
		const Response = await fetchGetJson<object, { auth : boolean }>( {
			path: EApiAuth.validate,
			auth: sessionToken,
			debug: true
		} ).catch( console.warn );
		if ( Response && Response.auth ) {
			return { loggedIn: true };
		}
	}

	return { loggedIn: false };
};

const useAuth = () => {

	return {};
};

export default useAuth;
export {
	validateLogin
};