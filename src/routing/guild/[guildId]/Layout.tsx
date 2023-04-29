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
import { tRPC_Guild }             from "@lib/tRPC";
import { EChannelType }           from "@shared/Enum/EDiscord";
import {
	DiscordForumChannel,
	DiscordRole,
	DiscordTextChannel,
	DiscordVoiceChannel
}                                 from "@shared/types/discord";
import { MO_Mod }                 from "@shared/types/MongoDB";
import {
	ForumChannelContext,
	TextChannelContext,
	VoiceChannelContext
}                                 from "@context/ChannelContext";
import { ModContext }             from "@context/ModContext";
import { RoleContext }            from "@context/RoleContext";

interface LoaderData extends LoaderGuild {
	textChannels : DiscordTextChannel[];
	forumChannels : DiscordForumChannel[];
	voiceChannels : DiscordVoiceChannel[];
	mods : MO_Mod[];
	roles : DiscordRole[];
}

const loader : LoaderFunction = async( { params } ) => {
	const query = await validateLoginWithGuild( params.guildId || "" );

	if ( !query.loggedIn || !query.guildData ) {
		window.location.replace( "/error/401" );
	}

	const [ textChannelsResult, forumChannelsResult, voiceChannelsResult, modsResult, rolesResult ] = await Promise.all( [
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.text
		} ),
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.forum
		} ),
		tRPC_Guild.channels.oftype.query( {
			guildId: query.guildData?.guildId!,
			type: EChannelType.voice
		} ),
		tRPC_Guild.modupdates.mods.query( {
			guildId: query.guildData?.guildId!
		} ),
		tRPC_Guild.roles.getrole.query( {
			guildId: query.guildData?.guildId!
		} )
	] );

	const textChannels : any[] = textChannelsResult?.channels || [];
	const forumChannels : any[] = forumChannelsResult?.channels || [];
	const voiceChannels : any[] = forumChannelsResult?.channels || [];
	const roles : any[] = rolesResult?.roles || [];
	const mods : any[] = modsResult?.mods || [];

	return json<LoaderData>( { ...query, textChannels, forumChannels, voiceChannels, mods, roles } );
};

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
	} = useLoaderData() as LoaderData;
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
	Component,
	loader
};
