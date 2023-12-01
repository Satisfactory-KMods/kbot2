import GuildContext from '@context/GuildContext';
import { Breadcrumb } from 'flowbite-react';
import { FC, useContext } from 'react';
import { BiServer } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';

const ServerMap: Record<string, string> = {
	'': 'Dashbaord',
	'chatcommands': 'Chat commands and reactions'
};

const TopSubbar: FC = () => {
	const { guildData } = useContext(GuildContext);
	const { pathname } = useLocation();

	return (
		<div className='flex w-full border-y border-gray-600 bg-gray-700 p-3 pe-6'>
			<Link className='flex flex-1 items-center' to={`#`}>
				<img
					src={guildData.guildData.iconURL || '/images/invalid.png'}
					alt={guildData.guildData.name}
					className='mr-3 h-6 rounded-full sm:h-9'
				/>
				<span className='self-center whitespace-nowrap text-xl font-semibold dark:text-white'>{guildData.guildData.name}</span>
			</Link>
			<Breadcrumb className=' hidden items-center md:flex'>
				<Breadcrumb.Item icon={BiServer}>{guildData.guildData.name}</Breadcrumb.Item>
				<Breadcrumb.Item>{ServerMap[pathname.split('/').pop()!] || 'Dashbaord'}</Breadcrumb.Item>
			</Breadcrumb>
		</div>
	);
};

export default TopSubbar;
