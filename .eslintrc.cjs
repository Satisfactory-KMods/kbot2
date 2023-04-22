require( "@rushstack/eslint-patch/modern-module-resolution" )

module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		'@vue/eslint-config-typescript',
		"@vue/typescript/recommended"
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		"no-trailing-spaces": [ "error" ],
		"computed-property-spacing": [ "error", "always" ],
		"space-before-function-paren": 0,
		"@typescript-eslint/indent": [ "error", "tab" ],
		indent: 0,
		"no-tabs": 0,
		camelcase: "off",
		semi: [ "error", "always" ],
		"no-multi-spaces": "off",
		"space-in-parens": [ "warn", "always" ],
		"array-bracket-spacing": [ "warn", "always" ],
		quotes: [ "warn", "double" ],
		"semi-style": [
			"error",
			"last"
		],
		"array-element-newline": "off",
		"keyword-spacing": [
			"error",
			{
				before: true
			}
		],
		"space-before-blocks": [
			"warn",
			"always"
		],
		"no-mixed-spaces-and-tabs": "off",
		"@typescript-eslint/no-var-requires": "off",
		"@typescript-eslint/no-non-null-asserted-optional-chain": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/no-empty-function": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": [
			"off",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_"
			}
		],
		"prefer-const": "warn",
		"no-control-regex": "off",
		"no-empty": "off",
		"no-var": "off",
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
	}
};
