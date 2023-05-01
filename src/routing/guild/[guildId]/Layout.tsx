import {
	FC,
	useState
}                                 from "react";
import {
	Outlet,
	useLoaderData,
	useParams
}                                 from "react-router-dom";
import { validateLoginWithGuild } from "@hooks/useAuth";
import GuildContext               from "@context/GuildContext";
import TopSubbar                  from "@comp/dashboard/TopSubbar";
import TopNavbar                  from "@comp/dashboard/TopNavbar";
import LeftSidebar                from "@comp/dashboard/LeftSidebar";
import { usePageTitle }           from "@kyri123/k-reactutils";
import {
	ForumChannelContext,
	TextChannelContext,
	VoiceChannelContext
}                                 from "@context/ChannelContext";
import { ModContext }             from "@context/ModContext";
import { RoleContext }            from "@context/RoleContext";
import { GuildLayoutLoaderData }  from "@guild/LayoutLoader";

const Component : FC = () => {
	const { guildId } = useParams();
	const {
		guildData,
		loggedIn,
		mods,
		textChannels,
		forumChannels,
		roles,
		voiceChannels
	} = useLoaderData() as GuildLayoutLoaderData;
	usePageTitle( `Kbot 2.0 - ${ guildData?.guildData.name || "Unkown" }` );

	const [ guild, setGuild ] = useState( () => guildData! );

	if ( !loggedIn || !guildData ) {
		return <></>;
	}

	const triggerGuildUpdate = async() => {
		const query = await validateLoginWithGuild( guildId || "" );

		setGuild( query.guildData! );
	};

	return (
		<GuildContext.Provider value={ { guildData: guild, triggerGuildUpdate } }>
			<TextChannelContext.Provider value={ textChannels }>
				<ModContext.Provider value={ mods }>
					<RoleContext.Provider value={ roles }>
						<ForumChannelContext.Provider value={ forumChannels }>
							<VoiceChannelContext.Provider value={ voiceChannels }>
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
							</VoiceChannelContext.Provider>
						</ForumChannelContext.Provider>
					</RoleContext.Provider>
				</ModContext.Provider>
			</TextChannelContext.Provider>
		</GuildContext.Provider>
	);
};

export {
	Component
};
