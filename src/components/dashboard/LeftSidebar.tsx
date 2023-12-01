import { Sidebar } from 'flowbite-react';
import { FC } from 'react';
import { BiBot } from 'react-icons/bi';
import { BsEmojiNeutral } from 'react-icons/bs';
import { HiAnnotation, HiChat, HiHome } from 'react-icons/hi';
import { SiDiscord, SiGithub, SiPatreon } from 'react-icons/si';
import { Link, useParams } from 'react-router-dom';

const LeftSidebar: FC = () => {
	const { guildId } = useParams();

	return (
		<div className='flex h-full w-fit flex-col border-r border-gray-600 dark:bg-gray-800'>
			<img src='/images/logo.png' className='m-3 mr-3 h-10 w-10' alt='KBot Logo' />
			<Sidebar
				className='flex'
				collapsed={true}
				theme={{
					root: {
						inner: 'h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800'
					}
				}}>
				<Sidebar.Items>
					<Sidebar.ItemGroup>
						<Sidebar.Item as={Link} to={`/guild/${guildId}/`} icon={HiHome}>
							Dashboard
						</Sidebar.Item>
						<Sidebar.Item as={Link} to={`/guild/${guildId}/chatcommands`} icon={HiChat}>
							Chat commands and reactions
						</Sidebar.Item>
						<Sidebar.Item as={Link} to={`/guild/${guildId}/modupdates`} icon={HiAnnotation}>
							Mod update announcement
						</Sidebar.Item>
						<Sidebar.Item as={Link} to={`/guild/${guildId}/patreon`} icon={SiPatreon}>
							Patreon exclusive content
						</Sidebar.Item>
						<Sidebar.Item as={Link} to={`/guild/${guildId}/reactionroles`} icon={BsEmojiNeutral}>
							Reaction roles
						</Sidebar.Item>
						<Sidebar.Item as={Link} target='_blank' to={import.meta.env.VITE_INVURL} icon={BiBot}>
							Invite
						</Sidebar.Item>
						<Sidebar.Item as={Link} target='_blank' to='https://github.com/Kyri123/kbot2' icon={SiGithub}>
							Source
						</Sidebar.Item>
						<Sidebar.Item as={Link} target='_blank' to='https://discord.gg/BeH4GRRWxc' icon={SiDiscord}>
							Discord
						</Sidebar.Item>
						<Sidebar.Item as={Link} target='_blank' to='https://www.patreon.com/kmods' icon={SiPatreon}>
							Donate
						</Sidebar.Item>
					</Sidebar.ItemGroup>
				</Sidebar.Items>
			</Sidebar>
		</div>
	);
};

export default LeftSidebar;
