import { FC }              from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                          from "react-router-dom";
import { validateLogin }   from "@hooks/useAuth";
import { ILoaderDataBase } from "@app/types/routing";

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( !result.loggedIn ) {
		window.location.replace( "/login" );
	}
	return json<ILoaderDataBase>( result );
};

const Component : FC = () => {
	const { loggedIn } = useLoaderData() as ILoaderDataBase;

	if ( !loggedIn ) {
		return ( <></> );
	}
	return ( <></> );
};


export {
	Component,
	loader
};