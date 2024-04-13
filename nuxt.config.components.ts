export const components: Parameters<typeof defineNuxtConfig>[0]['components'] = {
	global: true,
	dirs: [
		{
			path: '~/components/layout',
			prefix: 'Layout'
		},
		{
			path: '~/components/home',
			prefix: 'Home'
		},
		{
			path: '~/components/auth',
			prefix: 'Auth'
		},
		{
			path: '~/components/download',
			prefix: 'Download'
		},
		{
			path: '~/components/guild',
			prefix: 'Guild'
		},
		{
			path: '~/components/common',
			prefix: 'Common'
		}
	]
} as const;
