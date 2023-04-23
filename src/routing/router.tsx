import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}                          from "react-router-dom";
import LoadingPage         from "@routing/LoadingPage";
import React, { Suspense } from "react";
import ErrorPage           from "@routing/error/ErrorPage";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<Suspense fallback={ <LoadingPage/> }>
		<Route path="/" element={ <LoadingPage/> }>
			<Route path="/error/:ErrorCode" element={ <ErrorPage/> }/>
			<Route path="/guild/:id/*" lazy={ () => import("@guild/index") }/>

			<Route path="/signin" lazy={ () => import("@routing/signin") }/>
			<Route path="/signup/:authcode" lazy={ () => import("@routing/signup/[authcode]") }/>

			<Route path="/" element={ <Navigate to={ "/signin" }/> }/>
			<Route path="*" element={ <Navigate to={ "/error/404" }/> }/>
		</Route>
	</Suspense>
) );

const guildRouter = createBrowserRouter( createRoutesFromElements(
	<Suspense fallback={ <LoadingPage/> }>
		<Route path="/" element={ <LoadingPage/> }>
			<Route path="/error/:ErrorCode" element={ <ErrorPage/> }/>
			<Route path="/guild/:id/*" lazy={ () => import("@guild/index") }/>

			<Route path="/signin" lazy={ () => import("@routing/signin") }/>
			<Route path="/signup/:authcode" lazy={ () => import("@routing/signup/[authcode]") }/>

			<Route path="/" element={ <Navigate to={ "/signin" }/> }/>
			<Route path="*" element={ <Navigate to={ "/error/404" }/> }/>
		</Route>
	</Suspense>
) );


export {
	rootRouter,
	guildRouter
};