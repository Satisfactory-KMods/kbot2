module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		project: './tsconfig.json',
		extraFileExtensions: ['.vue']
	},
	extends: [
		'plugin:@typescript-eslint/stylistic-type-checked',
		'@nuxtjs/eslint-config-typescript',
		'plugin:prettier/recommended'
	],
	plugins: ['unused-imports'],
	rules: {
		'camelcase': 'off',
		'import/namespace': 'off',
		'@typescript-eslint/non-nullable-type-assertion-style': 'off',
		'@typescript-eslint/prefer-optional-chain': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/consistent-type-definitions': 'off',
		'no-console': ['warn'],
		'prefer-template': ['warn'],
		'vue/no-v-html': 'off',
		'vue/no-deprecated-slot-attribute': 'off',
		'no-console': ['warn'],
		'prefer-arrow-callback': 'warn',
		'arrow-body-style': ['warn', 'always'],
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/consistent-type-imports': 'error',
		'spaced-comment': 'off',
		'import/order': 'off',
		'unused-imports/no-unused-imports': 'error',
		'unused-imports/no-unused-vars': [
			'warn',
			{ vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
		],
		'prettier/prettier': 'off',
		'vue/multi-word-component-names': 'off'
	}
};
