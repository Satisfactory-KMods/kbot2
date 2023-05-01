import {
	json,
	LoaderFunction,
	redirect
}                         from "react-router-dom";
import { validateLogin }  from "@hooks/useAuth";
import { LoaderDataBase } from "@app/types/routing";

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( result.loggedIn ) {
		return redirect( "/" );
	}
	return json<LoaderDataBase>( result );
};

export {
	loader
};
