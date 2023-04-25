import {
	FC,
	PropsWithChildren
} from "react";
import {
	json,
	LoaderFunction,
	Outlet
} from "react-router-dom";

const loader : LoaderFunction = async( { request, params } ) => {
	const { guildId } = params;
	console.log( "layout", guildId );
	const data = {};
	return json( data );
};

const Component : FC<PropsWithChildren> = ( { children } ) => {

	return (
		<>
			<div className={ "d-flex flex-column h-100 w-100" }>
				<div className={ "flex-1 overflow-y-auto" }
					 style={ {
						 backgroundImage: "url(\"/images/background/6.jpg\")",
						 backgroundOrigin: "content-box",
						 backgroundRepeat: "no-repeat",
						 backgroundSize: "cover"
					 } }>

					<Outlet/>

				</div>
			</div>
		</>
	);
};

export {
	Component,
	loader
};
