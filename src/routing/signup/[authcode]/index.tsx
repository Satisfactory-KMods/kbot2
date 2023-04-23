import {
	json,
	LoaderFunction
}             from "react-router-dom";
import { FC } from "react";

export const loader : LoaderFunction = async( { request, params } ) => {
	return json( {} );
};


const Index : FC = () => {

	return (
		<></>
	);
};

export default Index;
