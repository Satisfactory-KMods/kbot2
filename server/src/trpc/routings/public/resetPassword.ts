import { handleTRCPErr } from '@server/lib/Express.Lib';
import { CreateSession } from '@server/lib/Session.Lib';
import DB_RegisterToken from '@server/mongodb/DB_RegisterToken';
import DB_UserAccount from '@server/mongodb/DB_UserAccount';
import { publicProcedure } from '@server/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const public_resetPassword = publicProcedure
	.input(
		z.object({
			password: z.string().min(8, { message: 'password or login is to short.' }),
			token: z.string()
		})
	)
	.mutation<{
		token: string;
		message: string;
	}>(async ({ input }) => {
		const { password, token } = input;
		try {
			const tokenDocument = await DB_RegisterToken.findOne({
				token,
				expire: { $gte: new Date() },
				isPasswordResetToken: true
			});
			if (!tokenDocument) {
				throw new TRPCError({ message: 'Token is invalid!', code: 'BAD_REQUEST' });
			}

			const userDocument = await DB_UserAccount.findOne({ discordId: tokenDocument.userId });
			if (!userDocument) {
				throw new TRPCError({ message: 'User not found', code: 'BAD_REQUEST' });
			}

			userDocument.setPassword(password);
			if (await userDocument.save()) {
				const token = await CreateSession(userDocument.toJSON());
				if (token) {
					await DB_RegisterToken.deleteMany({
						$or: [{ userId: tokenDocument.userId }, { expire: { $lte: new Date() } }]
					});
					return {
						token: token,
						message: 'Password reset successfully!'
					};
				}
				throw new TRPCError({ message: 'Error by creating Token!', code: 'INTERNAL_SERVER_ERROR' });
			}
			throw new TRPCError({ message: "User can't saved!", code: 'INTERNAL_SERVER_ERROR' });
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	});
