import { rGuildId } from '@server/zod/refineGuildId';
import { messageTextLimit } from '@shared/Default/discord';
import { MO_ChatCommands } from '@shared/types/MongoDB';
import * as mongoose from 'mongoose';
import z from 'zod';

const ZChatCommands = z.object({
	guildId: z.string().refine(rGuildId.c, rGuildId.m),
	command: z
		.string()
		.min(1, { message: 'Empty command is not allowed' })
		.max(messageTextLimit, { message: `Limit for a message is ${messageTextLimit}` }),
	alias: z.array(z.string().max(messageTextLimit, { message: `Limit for a message is ${messageTextLimit}` })),
	reactionText: z
		.string()
		.min(1, { message: 'Empty message is not allowed' })
		.max(messageTextLimit, { message: `Limit for a message is ${messageTextLimit}` }),
	autoReactionMatches: z.array(
		z.object({
			matchString: z.string().max(messageTextLimit, { message: `Limit for a message is ${messageTextLimit}` }),
			similarity: z.boolean()
		})
	)
});

const ChatCommandsSchema = new mongoose.Schema<MO_ChatCommands>({
	guildId: { type: String, required: true },
	command: { type: String, required: true },
	alias: { type: [String], required: true, default: [] },
	reactionText: { type: String, required: true },
	autoReactionMatches: {
		type: [
			{
				matchString: { type: String, required: true },
				similarity: { type: Boolean, required: true }
			}
		],
		required: true,
		default: []
	}
});

const DB_ChatCommands = mongoose.model<MO_ChatCommands>('KBot2_ChatCommands', ChatCommandsSchema);

const Revalidate = async () => {};

export default DB_ChatCommands;
export { ChatCommandsSchema, Revalidate, ZChatCommands };
