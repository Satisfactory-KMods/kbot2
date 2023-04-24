/** @type {import('tailwindcss').Config} */
import * as flowbite from 'flowbite';

module.exports = {
	important: true,
	mode: "jit",
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./shared/**/*.{js,ts,jsx,tsx}",
		'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
	theme: {
		extend: {}
	},
	plugins: [ flowbite ]
};
