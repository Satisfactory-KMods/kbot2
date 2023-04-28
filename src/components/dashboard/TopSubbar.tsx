import {
	FC,
	useContext
}                     from "react";
import guildContext   from "@context/guildContext";
import { Breadcrumb } from "flowbite-react";
import { BiServer }   from "react-icons/bi";
import {
	Link,
	useLocation
}                     from "react-router-dom";

const ServerMap : Record<string, string> = {
	"": "Dashbaord",
	"chatcommands": "Chat commands and reactions"
};

const TopSubbar : FC = () => {
	const { guildData } = useContext( guildContext );
	const { pathname } = useLocation();

	return (
		<div className="p-3 pe-6 flex w-full bg-gray-700 border-y border-gray-600">
			<Link className="flex items-center flex-1" to={ `#` }>
				<img src={ guildData.iconURL || "/images/invalid.png" } alt={ guildData.name }
				     className="mr-3 h-6 sm:h-9 rounded-full"/>
				<span
					className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">{ guildData.name }</span>
			</Link>
			<Breadcrumb className=" items-center hidden md:flex">
				<Breadcrumb.Item icon={ BiServer }>
					{ guildData.name }
				</Breadcrumb.Item>
				<Breadcrumb.Item>
					{ ServerMap[ pathname.split( "/" ).pop()! ] || "Dashbaord" }
				</Breadcrumb.Item>
			</Breadcrumb>
		</div>
	);
};

export default TopSubbar;
