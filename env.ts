import { z } from 'zod';

const version = '2.0.0';

const zodStringOrNumber = z
	.string()
	.or(z.number())
	.transform((v) => {
		return parseInt(String(v));
	});

export const env = z
	.object({
		// Auth secrete can generate using `openssl rand -hex 64`
		NEXTAUTH_SECRET: z.string(),
		// Discord client id & secret can be found in discord developer portal
		DISCORD_CLIENT_ID: z.string().regex(/^\d+$/),
		DISCORD_CLIENT_SECRET: z.string(),
		DISCORD_BOT_TOKEN: z.string(),
		// Next auth url
		NEXTAUTH_URL: z.string(),
		// Redis password, host and port (for caching different data)
		REDIS_PASSWORD: z.string(),
		REDIS_HOST: z.string(),
		REDIS_PORT: zodStringOrNumber,
		// Postgres password, user, db, host and port
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_USER: z.string(),
		POSTGRES_DB: z.string(),
		POSTGRES_HOST: z.string(),
		POSTGRES_PORT: zodStringOrNumber
	})
	.transform((env) => {
		return {
			version,
			dev: process.env.NODE_ENV !== 'production',
			nuxt: {
				public: {
					version,
					discordClientId: env.DISCORD_CLIENT_ID,
					discordInviteUrl: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&permissions=8&scope=bot`
				}
			},
			auth: {
				secret: env.NEXTAUTH_SECRET,
				url: env.NEXTAUTH_URL,
				discord: {
					token: env.DISCORD_BOT_TOKEN,
					clientId: env.DISCORD_CLIENT_ID,
					clientSecret: env.DISCORD_CLIENT_SECRET
				}
			},
			redis: {
				password: env.REDIS_PASSWORD,
				host: env.REDIS_HOST,
				port: env.REDIS_PORT
			},
			postgres: {
				password: env.POSTGRES_PASSWORD,
				user: env.POSTGRES_USER,
				database: env.POSTGRES_DB,
				host: env.POSTGRES_HOST,
				port: env.POSTGRES_PORT
			}
		};
	})
	.parse(process.env);
