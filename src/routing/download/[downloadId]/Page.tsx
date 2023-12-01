import LoadButton from '@comp/LoadButton';
import { usePageTitle } from '@kyri123/k-reactutils';
import { tRPC_Public, tRPC_handleError } from '@lib/tRPC';
import { TextInput } from 'flowbite-react';
import { FC, FormEvent, useRef, useState } from 'react';
import { BiCog, BiDownload } from 'react-icons/bi';
import { useParams } from 'react-router-dom';

const Component: FC = () => {
	usePageTitle(`Kbot 2.0 - Download Dev-Build`);
	const [isLoading, setIsLoading] = useState(false);
	const tokenRef = useRef<HTMLInputElement>(null);
	const { downloadId } = useParams();

	const [downloadUrl, setDownloadUrl] = useState<string>('');

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const token = tokenRef.current?.value || ';';
		if (token !== undefined) {
			const Response = await tRPC_Public.patreon.checkToken
				.mutate({
					token: token.clearWs(),
					file: downloadId!
				})
				.catch(tRPC_handleError);

			if (Response) {
				const url = `/api/v2/download/${Response.downloadId}`;
				window.open(url, '_blank');
				setDownloadUrl(url);
			}
		}

		setIsLoading(false);
	};

	return (
		<>
			<h1 className='text-center text-xl font-bold leading-tight tracking-tight text-gray-900 text-white md:text-2xl'>Download Dev-Build</h1>
			<form className='space-y-4' action='#' onSubmit={onSubmit}>
				{downloadUrl.clearWs() !== '' ? (
					<LoadButton
						className='w-full'
						isLoading={isLoading}
						href={downloadUrl}
						target={'_blank'}
						icon={<BiDownload className='mr-3 h-4 w-4' />}>
						Click here if the download has not started.
					</LoadButton>
				) : (
					<>
						<TextInput
							className='mt-6 w-full'
							ref={tokenRef}
							placeholder='your patreon token'
							helperText={'Type /patreon on our server to get your token!'}
						/>

						<LoadButton className='w-full' isLoading={isLoading} type={'submit'} icon={<BiCog className='mr-3 h-4 w-4' />}>
							Check my token
						</LoadButton>
					</>
				)}
			</form>
		</>
	);
};

export { Component };
