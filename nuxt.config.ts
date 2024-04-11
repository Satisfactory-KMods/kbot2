import ViteYaml from '@modyfi/vite-plugin-yaml';
import { resolve } from 'path';
import { env } from './env';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@vueuse/nuxt',
		'@sidebase/nuxt-auth',
		'@nuxt/image',
		'nuxt-icon',
		'@nuxtjs/color-mode',
		'nuxt-primevue',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/tailwindcss'
	],
	components: {
		global: true,
		dirs: [
			{
				path: '~/components/layout',
				prefix: 'Layout'
			}
		]
	},
	primevue: {
		options: {
			unstyled: true
		},
		importPT: { from: resolve(__dirname, './presets/wind/') }
	},
	vite: {
		plugins: [ViteYaml()]
	},
	alias: {
		cookie: 'cookie'
	},
	css: [
		'~/assets/css/tailwind.css',
		'primevue/resources/themes/lara-dark-blue/theme.css',
		'primeicons/primeicons.css'
	],
	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css'
	},
	devtools: { enabled: true },
	nitro: {
		storage: {
			redis: {
				driver: 'redis',
				...env.redis
			}
		},
		preset: 'node-server',
		hooks: {
			'dev:reload': () => {
				// @ts-ignore
				return require('sharp');
			}
		},
		runtimeConfig: {
			/**
			 * Will be available on both server and client
			 * we want to create urls to invite the bot to the server
			 * for exmaplte: runtimeConfig: https://discord.com/oauth2/authorize?client_id=${useRuntimeConfig().discordClientId}
			 */
			public: env.nuxt.public
		}
	}
});
