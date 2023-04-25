import { FC } from "react";
import {
	json,
	LoaderFunction
}             from "react-router-dom";

const loader : LoaderFunction = async( { request, params } ) => {
	return json( {} );
};

const Component : FC = () => {

	return (
		<>

		</>
	);
};

export {
	Component,
	loader
};
