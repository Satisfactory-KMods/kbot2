import {
	Navigate,
	RouterProvider
}                           from "react-router-dom";
import React, { useEffect } from "react";
import "@kyri123/k-javascript-utils/lib/useAddons";
import { rootRouter }       from "@routing/Router";
import { initFlowbite }     from "flowbite";
import useAuth              from "@hooks/useAuth";
import AuthContext          from "@context/AuthContext";

function App() {
	useEffect( initFlowbite, [] );
	const Auth = useAuth();

	return (
		<AuthContext.Provider value={ Auth }>
			<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
		</AuthContext.Provider>
	);
}

export default App;
