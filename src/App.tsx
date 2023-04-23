import {
	RouterProvider,
	useLocation
}                     from "react-router-dom";
import React          from "react";
import useAuth        from "@hooks/useAuth";
import { rootRouter } from "@routing/router";

function App() {
	const Location = useLocation();
	const Auth = useAuth();

	return (
		<RouterProvider router={ rootRouter }/>
	);
}

export default App;
