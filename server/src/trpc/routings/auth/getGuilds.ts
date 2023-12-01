import { handleTRCPErr } from '@server/lib/Express.Lib';
import DB_Guilds from '@server/mongodb/DB_Guilds';
import { publicProcedure } from '@server/trpc/trpc';
import { MO_Guild } from '@shared/types/MongoDB';
import { TRPCError } from '@trpc/server';

export const auth_getGuilds = publicProcedure.query<{
	guilds: MO_Guild[];
}>(async ({ ctx }) => {
	const { userClass } = ctx;
	try {
		if (userClass?.IsValid) {
			const guilds = await DB_Guilds.find({
				accountIds: { $in: userClass.Get.discordId },
				isInGuild: true
			});
			return { guilds };
		}
	} catch (e) {
		handleTRCPErr(e);
	}
	throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
});
