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
		'nuxt-primevue',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtjs/i18n',
		'@nuxtjs/tailwindcss'
	],
	primevue: {
		options: {
			unstyled: true
		},
		importPT: { from: resolve(__dirname, './presets/wind/') }
	},
	vite: {
		plugins: [ViteYaml()]
	},
	i18n: {
		defaultLocale: 'de',
		locales: ['en', 'de'],
		vueI18n: './i18n.config.ts' // if you are using custom path, default
	},
	alias: {
		cookie: 'cookie'
	},
	css: ['~/assets/css/tailwind.css', 'primevue/resources/themes/lara-dark-blue/theme.css'],
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
			public: {
				/**
				 * Will be available on both server and client
				 * we want to create urls to invite the bot to the server
				 * for exmaplte: runtimeConfig: https://discord.com/oauth2/authorize?client_id=${useRuntimeConfig().discordClientId}
				 */

				discordClientId: env.auth.discord.clientId
			}
		}
	}
});
