import {
	Navigate,
	RouterProvider
}                           from "react-router-dom";
import React, { useEffect } from "react";
import "@kyri123/k-javascript-utils/lib/useAddons";
import { rootRouter }       from "@routing/Router";
import { initFlowbite }     from "flowbite";
import useAuth              from "@hooks/useAuth";
import authContext          from "@context/authContext";

function App() {
	useEffect( initFlowbite, [] );
	const Auth = useAuth();

	return (
		<authContext.Provider value={ Auth }>
			<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
		</authContext.Provider>
	);
}

export default App;
