import {
	Navigate,
	RouterProvider
}                           from "react-router-dom";
import React, { useEffect } from "react";
import "@kyri123/k-javascript-utils/lib/useAddons";
import { rootRouter }       from "@routing/router";
import { initFlowbite }     from "flowbite";

function App() {

	useEffect( initFlowbite, [] );

	return (
		<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
	);
}

export default App;
