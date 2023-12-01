import { MO_Guild } from "@shared/types/MongoDB";
import { FC } from "react";
import { BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface IGuildSelectRowProps {
	guild : MO_Guild;
}

const GuildSelectRow : FC<IGuildSelectRowProps> = ( { guild } ) => {
	const navigate = useNavigate();

	return (
		<li className="p-0">
			<button className="flex items-center space-x-4 w-full py-3 sm:py-4 px-4 hover:bg-gray-700"
			        onClick={ () => navigate( `/guild/${ guild.guildId }/` ) }>
				<div className="shrink-0">
					<img
						className="h-12 w-12 rounded-full"
						src={ guild.guildData.iconURL || "/images/invalid.png" }
						alt={ guild.guildData.name }
					/>
				</div>
				<div className="min-w-0 flex-1 text-left">
					<p className="truncate font-medium text-gray-900 dark:text-white">
						{ guild.guildData.name }
					</p>
					<p className="truncate text-sm text-gray-500 dark:text-gray-400">
						<b>First Join:</b> { new Date( guild.createdAt || 0 ).toLocaleDateString() }
					</p>
				</div>
				<div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
					<BiUser className="mr-3"/> { guild.guildData.memberCount }
				</div>
			</button>
		</li>
	);
};

export default GuildSelectRow;
