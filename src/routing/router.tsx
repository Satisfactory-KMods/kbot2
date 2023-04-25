import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}            from "react-router-dom";
import React from "react";
import Index from "@routing/error/[ErrorCode]";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<>
		<Route path="error/:ErrorCode" element={ <Index/> }/>

		<Route lazy={ () => import("@routing/layout") }>
			<Route index lazy={ () => import("@routing/index") }/>
			<Route path="/login" lazy={ () => import("@routing/login") }/>
			<Route path="/register/:authCode" lazy={ () => import("@routing/register/[authCode]") }/>
			<Route path="/reset/:authCode" lazy={ () => import("@routing/reset/[authCode]") }/>
		</Route>

		<Route path="/guild/:guildId" lazy={ () => import("@guild/layout") }>
			<Route path="home" lazy={ () => import("@guild/index") }/>
		</Route>

		<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
	</>
) );


export {
	rootRouter
};