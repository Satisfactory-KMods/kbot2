import type { MenuItem } from 'primevue/menuitem';

export function useNavigationUrls() {
	const route = useRoute();
	const config = useRuntimeConfig().public;

	const params = useParams({
		values: {
			server: String()
		},
		event: checkParams
	});

	function checkParams() {
		if (
			(!params.server || !params.server.match(/^[0-9]*$/)) &&
			route.path.startsWith('/guild')
		) {
			throw createError({
				status: 404,
				message: 'No server provided',
				fatal: true
			});
		}
	}
	checkParams();

	const items = computed<
		(MenuItem & {
			description?: string;
			items?: (MenuItem & { description?: string })[] | undefined;
		})[]
	>(() => {
		if (!params.server || !route.path.startsWith('/guild')) {
			return [];
		}

		return [
			{
				separator: true
			},
			{
				label: 'Guild',
				items: [
					{
						label: 'Home',
						url: `/guild/${params.server}/`,
						description: 'Overview for links and features (Your are here)',
						icon: 'pi pi-home'
					},
					{
						label: 'Mod Update Announcements',
						url: `/guild/${params.server}/mod-announcements`,
						description: 'Configure announcements for your server and mods.',
						icon: 'pi pi-share-alt'
					},
					{
						label: 'Reaction Roles',
						url: `/guild/${params.server}/reaction-roles`,
						description: 'Configure reaction roles for your server',
						icon: 'pi pi-lock'
					},
					{
						label: 'Chat Commands and Reactions',
						url: `/guild/${params.server}/chat-commands`,
						description: 'Chat command and reaction configuration',
						icon: 'pi pi-comments'
					},
					{
						label: 'Preview Content',
						url: `/guild/${params.server}/preview-content`,
						description:
							'Upload preview content for your server. Public or Patreon only.',
						icon: 'pi pi-cloud-upload'
					}
				]
			},
			{
				label: 'Servers',
				items: [
					{
						label: 'Select a Servers',
						url: `/`,
						description: 'Back to the Server selection',
						icon: 'pi pi-server'
					}
				]
			},
			{
				label: 'Kbot2',
				items: [
					{
						label: 'Invite Kbot2',
						url: config.discordInviteUrl,
						external: true,
						description: 'Click here to invite Kbot2 to your server.',
						target: '_blank',
						icon: 'pi pi-discord'
					},
					{
						label: 'Discord Support',
						url: config.discordSupport,
						external: true,
						description: 'You can join our Discord server for support and feedback.',
						target: '_blank',
						icon: 'pi pi-discord'
					},
					{
						label: 'Github (Source Code)',
						url: config.githubRepo,
						external: true,
						description: 'This is the source code of Kbot2. Feel free to contribute.',
						target: '_blank',
						icon: 'pi pi-github'
					},
					{
						label: 'Support Us (Patreon)',
						url: config.patreonUrl,
						external: true,
						description: 'You can support us on Patreon. Thank you!',
						target: '_blank',
						icon: 'pi pi-money-bill'
					}
				]
			},
			{
				separator: true
			}
		];
	});

	return items;
}
