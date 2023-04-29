import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route
}            from "react-router-dom";
import React from "react";

const rootRouter = createBrowserRouter( createRoutesFromElements(
	<>
		<Route path="error/:ErrorCode" lazy={ () => import("@routing/error/[ErrorCode]/Index") }/>

		<Route lazy={ () => import("@routing/Layout") }>
			<Route index lazy={ () => import("@routing/Index") }/>
			<Route path="/login" lazy={ () => import("@routing/login/Index") }/>
			<Route path="/register/:authCode" lazy={ () => import("@routing/register/[authCode]/Index") }/>
			<Route path="/reset/:authCode" lazy={ () => import("@routing/reset/[authCode]/Index") }/>
		</Route>

		<Route path="/guild/:guildId" lazy={ () => import("@guild/Layout") }>
			<Route path="error/:ErrorCode" lazy={ () => import("@guild/error/[ErrorCode]/Index") }/>
			<Route path="chatcommands" lazy={ () => import("@guild/chatcommands/Index") }/>
			<Route path="modupdates" lazy={ () => import("@guild/modupdates/Index") }/>
			<Route path="patreon" lazy={ () => import("@guild/patreon/Index") }/>
			<Route path="home" lazy={ () => import("@guild/Index") }/>
			<Route index lazy={ () => import("@guild/Index") }/>
			<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
		</Route>

		<Route path="*" element={ <Navigate to={ "error/404" }/> }/>
	</>
) );


export {
	rootRouter
};