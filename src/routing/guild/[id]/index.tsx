import {
	json,
	LoaderFunction
}             from "react-router-dom";
import { FC } from "react";

export const loader : LoaderFunction = async( { request, params } ) => {
	const { guildId } = params;
	const data = {};
	return json( data );
};


const Index : FC = () => {

	return (
		<></>
	);
};

export default Index;
