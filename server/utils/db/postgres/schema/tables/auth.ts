import type { AdapterAccount } from '@auth/core/adapters';
import { boolean, colTimestamp, integer, primaryKey, text } from '@kmods/drizzle-pg/pg-core';
import { dbSchema } from '../pgSchema';

export const users = dbSchema.table('user', {
	id: text('id').notNull().primaryKey(),
	name: text('name'),
	email: text('email').notNull(),
	emailVerified: colTimestamp('emailVerified'),
	image: text('image'),
	hoster: boolean('hoster').notNull().default(false)
});

export const accounts = dbSchema.table(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(
				() => {
					return users.id;
				},
				{ onDelete: 'cascade' }
			),
		type: text('type').$type<AdapterAccount['type']>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => {
		return {
			compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
		};
	}
);

export const sessions = dbSchema.table('session', {
	sessionToken: text('sessionToken').notNull().primaryKey(),
	userId: text('userId')
		.notNull()
		.references(
			() => {
				return users.id;
			},
			{ onDelete: 'cascade' }
		),
	expires: colTimestamp('expires').notNull()
});

export const verificationTokens = dbSchema.table(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: colTimestamp('expires').notNull()
	},
	(vt) => {
		return {
			compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
		};
	}
);
