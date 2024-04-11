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
