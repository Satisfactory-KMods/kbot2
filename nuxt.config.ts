import ViteYaml from '@modyfi/vite-plugin-yaml';
import { resolve } from 'path';
import { components } from './nuxt.config.components';
import { nitro } from './nuxt.config.nitro';

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
	colorMode: {
		classSuffix: '',
		preference: 'light'
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
		'primeicons/primeicons.css',
		'vue3-emoji-picker/css'
	],
	tailwindcss: {
		cssPath: '~/assets/css/tailwind.css'
	},
	pages: true,
	devtools: { enabled: true },
	components,
	nitro
});
