import DB_SessionToken from '@server/mongodb/DB_SessionToken';
import DB_UserAccount from '@server/mongodb/DB_UserAccount';
import { publicProcedure } from '@server/trpc/trpc';
import { MO_UserAccount } from '@shared/types/MongoDB';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';

export const public_validate = publicProcedure
	.input(
		z.object({
			token: z.string()
		})
	)
	.query<{
		tokenValid: boolean;
	}>(async ({ input }) => {
		try {
			const result = (await jwt.verify(input.token, process.env.JWTToken || '')) as MO_UserAccount;
			const userAccountExsists = !!(await DB_UserAccount.exists({ _id: result._id }));
			if (!userAccountExsists) {
				DB_SessionToken.deleteMany({ userid: result._id });
			}
			return { tokenValid: !!(await DB_SessionToken.exists({ token: input.token })) && userAccountExsists };
		} catch (e) {}
		return { tokenValid: false };
	});
