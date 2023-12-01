import { handleTRCPErr } from '@server/lib/Express.Lib';
import { reapplyReactionRoles } from '@server/lib/bot/guild.lib';
import DB_ReactionRoles from '@server/mongodb/DB_ReactionRoles';
import { guildProcedure, router } from '@server/trpc/trpc';
import { MO_ReactionRoles } from '@shared/types/MongoDB';
import { DiscordMessage } from '@shared/types/discord';
import { TRPCError } from '@trpc/server';
import _ from 'lodash';
import z from 'zod';

export const guild_reactionRoles = router({
	getReactionRoles: guildProcedure.query<{
		reactionRoles: MO_ReactionRoles[];
		messages: Record<string, DiscordMessage>;
	}>(async ({ ctx }) => {
		const { userClass, guildId, guild } = ctx;
		try {
			if (userClass?.IsValid && guildId && guild) {
				const reactionRoles: MO_ReactionRoles[] = [];
				const messages: Record<string, DiscordMessage> = {};

				for await (const command of await DB_ReactionRoles.find({ guildId })) {
					reactionRoles.push(command.toJSON());
					const channel = await guild.textChannel(command.channelId);
					const message = await guild.message(command.messageId, command.channelId);
					if (channel && message) {
						messages[message.id] = message.toJSON() as DiscordMessage;
					}
				}

				return { reactionRoles, messages };
			}
		} catch (e) {
			handleTRCPErr(e);
		}
		throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
	}),

	modifyReactionRole: guildProcedure
		.input(
			z.object({
				id: z.string().min(10, 'Id is to short').optional(),
				remove: z.boolean().optional(),
				data: z.object({
					channelId: z.string().min(10, 'Channel id is to short'),
					messageId: z.string().min(10, 'Message id is to short'),
					reactions: z
						.array(
							z.object({
								emoji: z.string().min(1, 'Emoji is empty'),
								roleIds: z.array(z.string().min(10, 'Channel id is to short')).min(1, 'Reactions need min 1 role')
							})
						)
						.min(1, 'At least one reaction is required')
				})
			})
		)
		.mutation<{
			message: string;
			data?: MO_ReactionRoles;
		}>(async ({ ctx, input }) => {
			const { guild } = ctx;
			const { id, remove, data, guildId } = input;
			const { messageId, reactions, channelId } = data;
			try {
				if (!id) {
					if (await DB_ReactionRoles.exists({ guildId, messageId })) {
						throw new TRPCError({
							message: 'This messagee has already reaction roles',
							code: 'BAD_REQUEST'
						});
					}
				}

				let reactionRoleDocument = new DB_ReactionRoles();
				if (id) {
					reactionRoleDocument = (await DB_ReactionRoles.findByIdAndUpdate(id, { data }, { new: true }))!;
				} else if (!!remove && !!id) {
					reactionRoleDocument = (await DB_ReactionRoles.findByIdAndRemove(id))!;
				}

				reactionRoleDocument.guildId = guildId;
				reactionRoleDocument.channelId = channelId;
				reactionRoleDocument.messageId = messageId;
				reactionRoleDocument.reactions = reactions;

				if (reactionRoleDocument && guild) {
					const message = await guild.message(reactionRoleDocument.messageId, reactionRoleDocument.channelId);
					if (message) {
						const copy: MO_ReactionRoles = _.cloneDeep(reactionRoleDocument.toJSON());
						if (remove) {
							copy.reactions.length = 0;
						}
						await reapplyReactionRoles(message, copy);
					}
				}

				if (!remove && (await reactionRoleDocument.save())) {
					return {
						data: reactionRoleDocument.toJSON(),
						message: id ? 'Successfully modified' : 'Successfully added'
					};
				}
				return { message: 'Reaction role was removed' };
			} catch (e) {
				handleTRCPErr(e);
			}
			throw new TRPCError({ message: 'Something goes wrong!', code: 'INTERNAL_SERVER_ERROR' });
		})
});
