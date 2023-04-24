import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}                from "react-router-dom";
import React     from "react";
import ErrorPage from "@routing/error/ErrorPage";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<>
		<Route path="error/:ErrorCode" element={ <ErrorPage/> }/>

		<Route lazy={ () => import("@routing/layout") }>
			<Route index lazy={ () => import("@routing/index") }/>
			<Route path="/login" lazy={ () => import("@routing/login") }/>
			<Route path="/register/:authcode" lazy={ () => import("@routing/register/[authcode]") }/>
		</Route>

		<Route path="/guild/:guildId" lazy={ () => import("@guild/layout") }>
			<Route path="home" lazy={ () => import("@guild/index") }/>
		</Route>

		<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
	</>
) );

const guildRouter = (
	<>
		<Route path="error/:ErrorCode" element={ <ErrorPage/> }/>

		<Route path="/" element={ <Navigate to={ "home" }/> }>
			<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
		</Route>
	</>
);


export {
	rootRouter,
	guildRouter
};