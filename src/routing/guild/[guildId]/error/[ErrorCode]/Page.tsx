import { validateLogin } from '@hooks/useAuth';
import { usePageTitle } from '@kyri123/k-reactutils';
import { Button } from 'flowbite-react';
import { FC, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const Component: FC = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const { ErrorCode, guildId } = useParams();
	const { pathname } = useLocation();
	usePageTitle(`Kbot 2.0 - Error ${ErrorCode}`);

	useEffect(() => {
		validateLogin().then((res) => setLoggedIn(() => res.loggedIn));
	}, []);

	const Err = {
		code: ErrorCode,
		message: `Page not found!`
	};
	switch (ErrorCode) {
		case '403':
		case '401':
			Err.message = `You are not authorized to access this page!`;
			break;
		default:
	}

	return (
		<div className='mx-auto flex h-full flex-col items-center justify-center px-6 py-8 lg:py-0'>
			<span className='text-4xl text-white md:text-8xl'>Error {Err.code}</span>
			<span className='mt-5 text-2xl text-white md:text-4xl'>{Err.message}</span>
			<Button href={`/guild/${guildId}/`} color='gray' className='mt-6 flex items-center justify-center'>
				Back to Home
			</Button>
		</div>
	);
};

export { Component };
