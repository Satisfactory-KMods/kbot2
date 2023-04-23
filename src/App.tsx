import {
	BrowserRouter,
	Navigate,
	Route,
	Routes
}                          from "react-router-dom";
import Layout              from "./Layout";
import React, { Suspense } from "react";

import LoadingPage from "@routing/LoadingPage";
import ErrorPage   from "@routing/error/ErrorPage";

function App() {

	return (
		<BrowserRouter>
			<Layout>
				<Suspense fallback={ <LoadingPage/> }>
					<Routes>
						<Route path="/error/:ErrorCode" element={ <ErrorPage/> }/>

						<Route path="*" element={ <Navigate to="/error/404"/> }/>
					</Routes>
				</Suspense>
			</Layout>
		</BrowserRouter>
	);
}

export default App;
