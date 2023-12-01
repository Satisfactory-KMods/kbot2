/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
	theme: {},
	plugins: [require('flowbite/plugin')]
};
