import { FC }               from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                           from "react-router-dom";
import { IMO_ChatCommands } from "@shared/types/MongoDB";

interface ILoaderData {
	chatReactions : IMO_ChatCommands;
}

const loader : LoaderFunction = async( { request, params } ) => {
	return json<ILoaderData>( {
		chatReactions: {} as IMO_ChatCommands
	} );
};

const Component : FC = () => {
	const { chatReactions } = useLoaderData() as ILoaderData;

	return ( <></> );
};


export {
	Component,
	loader
};