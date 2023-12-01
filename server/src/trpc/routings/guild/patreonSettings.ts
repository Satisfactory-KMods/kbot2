import { handleTRCPErr } from '@server/lib/Express.Lib';
import DB_Guilds from '@server/mongodb/DB_Guilds';
import DB_PatreonReleases from '@server/mongodb/DB_PatreonReleases';
import { guildProcedure, router } from '@server/trpc/trpc';
import { MO_PatreonReleases } from '@shared/types/MongoDB';
import { TRPCError } from '@trpc/server';
import z from 'zod';

export const guild_patreon = router({
	updateSettings: guildProcedure
		.input(
			z.object({
				pingRoles: z.array(z.string()),
				announcementChannel: z.string(),
				changelogForum: z.string(),
				patreonReleaseText: z.string()
			})
		)
		.mutation<{
			message: string;
		}>(async ({ input, ctx }) => {
			const { guild } = ctx;
			const { pingRoles, announcementChannel, changelogForum, patreonReleaseText } = input;
			try {
				if (guild) {
					await DB_Guilds.findOneAndUpdate(
						{ guildId: guild.guildId },
						{
							'patreonOptions.pingRoles': pingRoles,
							'patreonOptions.announcementChannel': announcementChannel,
							'patreonOptions.changelogForum': changelogForum,
							'patreonOptions.patreonReleaseText': patreonReleaseText
						}
					);
					console.log('Settings saved.');
					return { message: 'Settings saved.' };
				}
			} catch (e) {
				console.log(e);
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
		}),

	released: guildProcedure.query<{
		releases: MO_PatreonReleases[];
	}>(async ({ ctx }) => {
		const releases: MO_PatreonReleases[] = await DB_PatreonReleases.find<MO_PatreonReleases>({ guildId: ctx.guildId || '0' });
		return { releases };
	})
});
