import type { DefaultSession } from 'next-auth';

// ts global for yaml
declare module '*.yaml' {
	const json: Record<string, string>;
	export default json;
}

declare module '*.yml' {
	const json: Record<string, string>;
	export default json;
}

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			id: string;
			name: string;
			email: string;
			image: string;
			discordId: string;
			superAdmin: boolean;
		};
		expires: string;
	}
}

declare module 'nuxt/schema' {
	interface PublicRuntimeConfig {
		version: string;
		discordClientId: string;
		discordInviteUrl: string;
		patreonUrl: string;
		githubRepo: string;
		discordSupport: string;
	}
}

// It is always important to ensure you import/export something when augmenting a type
export {};
