import type tailwind from 'tailwindcss';
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./presets/**/*.{js,ts}',
		'./components/**/*.{ts,js,vue}',
		'./pages/**/*.{ts,js,vue}'
	],
	theme: {
		extend: {
			colors: {
				'primary-50': 'var(--primary-50)',
				'primary-100': 'var(--primary-100)',
				'primary-200': 'var(--primary-200)',
				'primary-300': 'var(--primary-300)',
				'primary-400': 'var(--primary-400)',
				'primary-500': 'var(--primary-500)',
				'primary-600': 'var(--primary-600)',
				'primary-700': 'var(--primary-700)',
				'primary-800': 'var(--primary-800)',
				'primary-900': 'var(--primary-900)',
				'primary-950': 'var(--primary-950)',
				'surface-0': 'var(--surface-0)',
				'surface-50': 'var(--surface-50)',
				'surface-100': 'var(--surface-100)',
				'surface-200': 'var(--surface-200)',
				'surface-300': 'var(--surface-300)',
				'surface-400': 'var(--surface-400)',
				'surface-500': 'var(--surface-500)',
				'surface-600': 'var(--surface-600)',
				'surface-700': 'var(--surface-700)',
				'surface-800': 'var(--surface-800)',
				'surface-900': 'var(--surface-900)',
				'surface-950': 'var(--surface-950)',
				'kmods_primary': {
					'50': '#f3f7fc',
					'100': '#e6eff8',
					'200': '#c8deef',
					'300': '#97c3e2',
					'400': '#5fa4d1',
					'500': '#3b88bc',
					'600': '#2a6c9f',
					'700': '#265e8b',
					'800': '#214a6b',
					'900': '#20405a',
					'950': '#15283c',
					'default': '#265e8b'
				},
				'kmods_secondary': {
					'50': '#effaf4',
					'100': '#d8f3e2',
					'200': '#b3e7c8',
					'300': '#81d4a8',
					'400': '#4dba84',
					'500': '#268c5d',
					'600': '#1c7f53',
					'700': '#166645',
					'800': '#145138',
					'900': '#114330',
					'950': '#09251a',
					'default': '#268c5d'
				}
			}
		}
	}
} satisfies tailwind.Config;
