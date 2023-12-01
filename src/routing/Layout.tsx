import Ribbon from '@comp/elements/Ribbon';
import AuthContext from '@context/AuthContext';
import { Button } from 'flowbite-react';
import { FC, useContext } from 'react';
import { BiBot } from 'react-icons/bi';
import { BsDoorOpen } from 'react-icons/bs';
import { SiDiscord, SiGithub, SiPatreon } from 'react-icons/si';
import { Link, Outlet } from 'react-router-dom';

const Component: FC = () => {
	const [user, logout] = useContext(AuthContext);
	return (
		<section className='bg-gray-900'>
			<div className='mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0'>
				<div className='flex w-full sm:max-w-md'>
					<Link to='#' className='mb-6 flex flex-1 items-center text-2xl font-semibold text-gray-900 text-white'>
						<img className='mr-2 h-8 w-8' src='/images/logo.png' alt='logo' />
						KBot 2.0
					</Link>
					{user.IsValid && (
						<Button color='gray' onClick={logout}>
							<BsDoorOpen className='mr-3 h-4 w-4' />
							Logout
						</Button>
					)}
				</div>
				<div className='w-full rounded-lg border border-gray-700 bg-gray-800 shadow sm:max-w-md md:mt-0 xl:p-0'>
					<div className='relative space-y-4 p-6 sm:p-8 md:space-y-6'>
						<Ribbon color='red'>Alpha</Ribbon>
						<Outlet />

						<div className='flex flex-wrap gap-2'>
							<Button href={'https://github.com/Kyri123/kbot2'} target='_blank' color='gray' className='flex-1'>
								<SiGithub className='mr-3 h-4 w-4' />
								Source
							</Button>
							<Button href={'https://www.patreon.com/kmods'} target='_blank' color='gray' className='flex-1'>
								<SiPatreon className='mr-3 h-4 w-4' />
								Donate
							</Button>
							<Button href={'https://discord.gg/BeH4GRRWxc'} target='_blank' color='gray' className='flex-1'>
								<SiDiscord className='mr-3 h-4 w-4' />
								Discord
							</Button>
							<Button href={import.meta.env.VITE_INVURL} target='_blank' color='green' className='flex-1'>
								<BiBot className='mr-3 h-4 w-4' />
								Invite
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export { Component };
