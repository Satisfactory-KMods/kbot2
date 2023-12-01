import DB_Guilds from '@server/mongodb/DB_Guilds';
import { guildProcedure } from '@server/trpc/trpc';
import { MO_Guild } from '@shared/types/MongoDB';
import { z } from 'zod';

export const guild_validate = guildProcedure
	.input(
		z.object({
			guildId: z.string()
		})
	)
	.query<{
		tokenValid: boolean;
		guildData?: MO_Guild;
	}>(async ({ input, ctx }) => {
		try {
			if (input.guildId && ctx.userClass?.IsValid) {
				const guildDocument = await DB_Guilds.findOne({
					guildId: input.guildId,
					accountIds: { $in: ctx.userClass.Get.discordId }
				});
				if (guildDocument) {
					return {
						tokenValid: true,
						guildData: guildDocument.toJSON()
					};
				}
			}
		} catch (e) {}
		return { tokenValid: false };
	});
