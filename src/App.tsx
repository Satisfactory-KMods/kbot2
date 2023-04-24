import {
	Navigate,
	RouterProvider
}                     from "react-router-dom";
import React          from "react";
import "@kyri123/k-javascript-utils/lib/useAddons";
import { rootRouter } from "@routing/router";

function App() {

	return (
		<RouterProvider router={ rootRouter } fallbackElement={ <Navigate to={ "/error/404" }/> }/>
	);
}

export default App;
