import {
	FC,
	PropsWithChildren
}                                 from "react";
import {
	json,
	LoaderFunction,
	Outlet,
	useLoaderData
}                                 from "react-router-dom";
import { validateLoginWithGuild } from "@hooks/useAuth";
import guildContext               from "@context/guildContext";
import { ILoaderGuild }           from "@app/types/routing";
import TopSubbar                  from "@comp/dashboard/TopSubbar";
import TopNavbar                  from "@comp/dashboard/TopNavbar";
import LeftSidebar                from "@comp/dashboard/LeftSidebar";
import { usePageTitle }           from "@kyri123/k-reactutils";

const loader : LoaderFunction = async( { request, params } ) => {
	const query = await validateLoginWithGuild( params.guildId || "" );

	if ( !query.loggedIn || !query.guildData ) {
		window.location.replace( "/error/401" );
	}

	return json( query );
};

const Component : FC<PropsWithChildren> = ( { children } ) => {
	const { guildData, loggedIn } = useLoaderData() as ILoaderGuild;
	usePageTitle( `Kbot 2.0 - ${ guildData?.guildData.name || "Unkown" }` );

	if ( !loggedIn || !guildData ) {
		return <></>;
	}

	return (
		<guildContext.Provider value={ guildData }>
			<div className={ "flex flex-col h-full w-full" }>
				<TopNavbar/>
				<div className={ "flex-1 flex" }>
					<LeftSidebar/>
					<div className={ "flex-1 flex flex-col" }>
						<TopSubbar/>
						<div className={ "flex-1 overflow-y-auto overflow-x-hidden" }>
							<Outlet/>
						</div>
					</div>
				</div>
			</div>
		</guildContext.Provider>
	);
};

export {
	Component,
	loader
};
