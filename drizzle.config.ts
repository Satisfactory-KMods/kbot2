import { type Config } from 'drizzle-kit';

import { env } from './env';

export default {
	schema: './server/utils/db/postgres/schema',
	dialect: 'postgresql',
	out: './server/utils/db/postgres/migrations',
	dbCredentials: env.postgres
} satisfies Config;
