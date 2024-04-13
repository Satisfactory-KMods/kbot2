import type { MenuItem } from 'primevue/menuitem';

export function useNavigationUrls() {
	const route = useRoute();
	const { params } = useParams({
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
				separator: true
			}
		];
	});

	return items;
}
