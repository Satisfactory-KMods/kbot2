import { Sidebar } from "flowbite-react";
import { FC }      from "react";
import {
	HiChat,
	HiHome
}                  from "react-icons/hi";
import {
	Link,
	useParams
}                  from "react-router-dom";
import {
	BiBot,
	SiDiscord,
	SiGithub,
	SiPatreon
}                  from "react-icons/all";

const LeftSidebar : FC = () => {
	const { guildId } = useParams();

	return (
		<div className="w-fit h-full dark:bg-gray-800 flex flex-col border-r border-gray-600">
			<img src="/images/logo.png" className="mr-3 h-10 w-10 m-3"
			     alt="KBot Logo"/>
			<Sidebar className="grow-0 h-0" collapsed={ true } theme={ {
				root: {
					inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800"
				}
			} }>
				<Sidebar.Items>
					<Sidebar.ItemGroup>
						<Sidebar.Item as={ Link } to={ `/guild/${ guildId }/` } icon={ HiHome }>
							Dashboard
						</Sidebar.Item>
						<Sidebar.Item as={ Link } to={ `/guild/${ guildId }/chatcommands` } icon={ HiChat }>
							Chat commands and reactions
						</Sidebar.Item>
					</Sidebar.ItemGroup>
				</Sidebar.Items>
			</Sidebar>
			<Sidebar collapsed={ true } theme={ {
				root: {
					inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-800 flex flex-col"
				}
			} } className="flex-1 grow h-full">
				<Sidebar.ItemGroup>
					<Sidebar.Item as={ Link } target="_blank" to={ import.meta.env.VITE_INVURL }
					              icon={ BiBot }>
						Invite
					</Sidebar.Item>
					<Sidebar.Item as={ Link } target="_blank" to="https://github.com/Kyri123/kbot2"
					              icon={ SiGithub }>
						Source
					</Sidebar.Item>
					<Sidebar.Item as={ Link } target="_blank" to="https://discord.gg/BeH4GRRWxc"
					              icon={ SiDiscord }>
						Discord
					</Sidebar.Item>
					<Sidebar.Item as={ Link } target="_blank" to="https://www.patreon.com/kmods"
					              icon={ SiPatreon }>
						Donate
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar>
		</div>
	);
};

export default LeftSidebar;
