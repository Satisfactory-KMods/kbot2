import LeftSidebar from '@comp/dashboard/LeftSidebar';
import TopNavbar from '@comp/dashboard/TopNavbar';
import TopSubbar from '@comp/dashboard/TopSubbar';
import { ForumChannelContext, TextChannelContext, VoiceChannelContext } from '@context/ChannelContext';
import GuildContext from '@context/GuildContext';
import { ModContext } from '@context/ModContext';
import { RoleContext } from '@context/RoleContext';
import { GuildLayoutLoaderData } from '@guild/LayoutLoader';
import { validateLoginWithGuild } from '@hooks/useAuth';
import { usePageTitle } from '@kyri123/k-reactutils';
import { FC, useState } from 'react';
import { Outlet, useLoaderData, useParams } from 'react-router-dom';

const Component: FC = () => {
	const { guildId } = useParams();
	const { guildData, loggedIn, mods, textChannels, forumChannels, roles, voiceChannels } = useLoaderData() as GuildLayoutLoaderData;
	usePageTitle(`Kbot 2.0 - ${guildData?.guildData.name || 'Unkown'}`);

	const [guild, setGuild] = useState(() => guildData!);

	if (!loggedIn || !guildData) {
		return <></>;
	}

	const triggerGuildUpdate = async () => {
		const query = await validateLoginWithGuild(guildId || '');

		setGuild(query.guildData!);
	};

	return (
		<GuildContext.Provider value={{ guildData: guild, triggerGuildUpdate }}>
			<TextChannelContext.Provider value={textChannels}>
				<ModContext.Provider value={mods}>
					<RoleContext.Provider value={roles}>
						<ForumChannelContext.Provider value={forumChannels}>
							<VoiceChannelContext.Provider value={voiceChannels}>
								<div className={'flex h-screen overflow-y-hidden'}>
									<div className={'flex flex-1'}>
										<LeftSidebar />
										<div className={'flex h-full flex-1 flex-col overflow-hidden'}>
											<TopNavbar />
											<TopSubbar />
											<div className='max-h-full flex-1 overflow-hidden overflow-y-scroll p-5'>
												<div className={'mx-auto flex w-full flex-col md:h-full md:max-w-screen-xl lg:py-0'}>
													<div className='w-full p-4'>
														<Outlet />
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

export { Component };
