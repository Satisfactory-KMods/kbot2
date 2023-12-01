import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';

const rootRouter = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path='error/:ErrorCode' lazy={() => import('@routing/error/[ErrorCode]/Page')} />

			<Route lazy={() => import('@routing/Layout')}>
				<Route
					index
					loader={async ({ request, params }) => {
						const { loader } = await import('@routing/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@routing/Page')}
				/>

				<Route
					path='/login'
					loader={async ({ request, params }) => {
						const { loader } = await import('@routing/login/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@routing/login/Page')}
				/>

				<Route
					path='/register/:authCode'
					loader={async ({ request, params }) => {
						const { loader } = await import('@routing/register/[authCode]/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@routing/register/[authCode]/Page')}
				/>

				<Route
					path='/reset/:authCode'
					loader={async ({ request, params }) => {
						const { loader } = await import('@routing/reset/[authCode]/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@routing/reset/[authCode]/Page')}
				/>

				<Route
					path='/download/:downloadId'
					loader={async ({ request, params }) => {
						const { loader } = await import('@routing/download/[downloadId]/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@routing/download/[downloadId]/Page')}
				/>
			</Route>

			<Route
				path='/guild/:guildId'
				loader={async ({ request, params }) => {
					const { loader } = await import('@guild/LayoutLoader');
					return loader({ request, params });
				}}
				lazy={() => import('@guild/Layout')}>
				<Route
					path='chatcommands'
					loader={async ({ request, params }) => {
						const { loader } = await import('@guild/chatcommands/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@guild/chatcommands/Page')}
				/>

				<Route
					path='modupdates'
					loader={async ({ request, params }) => {
						const { loader } = await import('@guild/modupdates/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@guild/modupdates/Page')}
				/>

				<Route
					path='reactionroles'
					loader={async ({ request, params }) => {
						const { loader } = await import('@guild/reactionroles/Loader');
						return loader({ request, params });
					}}
					lazy={() => import('@guild/reactionroles/Page')}
				/>

				<Route path='patreon' lazy={() => import('@guild/patreon/Page')} />

				<Route path='error/:ErrorCode' lazy={() => import('@guild/error/[ErrorCode]/Page')} />
				<Route index lazy={() => import('@guild/Page')} />
				<Route path='*' element={<Navigate to={'error/404'} />} />
			</Route>

			<Route path='*' element={<Navigate to={'error/404'} />} />
		</>
	)
);

export { rootRouter };
