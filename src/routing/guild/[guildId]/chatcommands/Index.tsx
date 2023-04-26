import { FC }                from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                            from "react-router-dom";
import { IMO_TextReactions } from "@shared/types/MongoDB";

interface ILoaderData {
	chatReactions : IMO_TextReactions;
}

const loader : LoaderFunction = async( { request, params } ) => {
	return json<ILoaderData>( {
		chatReactions: {} as IMO_TextReactions
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