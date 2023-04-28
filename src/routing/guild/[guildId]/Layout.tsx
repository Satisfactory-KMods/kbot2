import {
	FC,
	useState
}                                 from "react";
import {
	json,
	LoaderFunction,
	Outlet,
	useLoaderData,
	useParams
}                                 from "react-router-dom";
import { validateLoginWithGuild } from "@hooks/useAuth";
import GuildContext               from "@context/GuildContext";
import { LoaderGuild }            from "@app/types/routing";
import TopSubbar                  from "@comp/dashboard/TopSubbar";
import TopNavbar                  from "@comp/dashboard/TopNavbar";
import LeftSidebar                from "@comp/dashboard/LeftSidebar";
import { usePageTitle }           from "@kyri123/k-reactutils";

const loader : LoaderFunction = async( { params } ) => {
	const query = await validateLoginWithGuild( params.guildId || "" );

	if ( !query.loggedIn || !query.guildData ) {
		window.location.replace( "/error/401" );
	}

	return json( query );
};

const Component : FC = () => {
	const { guildId } = useParams();
	const { guildData, loggedIn } = useLoaderData() as LoaderGuild;
	usePageTitle( `Kbot 2.0 - ${ guildData?.guildData.name || "Unkown" }` );

	const [ guild, setGuild ] = useState( () => guildData! );

	if ( !loggedIn || !guildData ) {
		return <></>;
	}

	const triggerGuildUpdate = async() => {
		const query = await validateLoginWithGuild( guildId || "" );

		if ( !query.loggedIn || !query.guildData ) {
			window.location.replace( "/error/401" );
		}

		setGuild( query.guildData! );
	};

	return (
		<GuildContext.Provider value={ { guildData: guild, triggerGuildUpdate } }>
			<div className={ "flex h-screen overflow-y-hidden" }>
				<div className={ "flex-1 flex" }>
					<LeftSidebar/>
					<div className={ "flex flex-col flex-1 h-full overflow-hidden" }>
						<TopNavbar/>
						<TopSubbar/>
						<div className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
							<div
								className={ "flex flex-col mx-auto md:h-full lg:py-0 w-full md:max-w-screen-xl" }>
								<div className="w-full p-4">
									<Outlet/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</GuildContext.Provider>
	);
};

export {
	Component,
	loader
};
