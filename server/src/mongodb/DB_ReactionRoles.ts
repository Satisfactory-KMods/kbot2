import { MO_ReactionRoles } from '@shared/types/MongoDB';
import * as mongoose from 'mongoose';

const ReactionRoleSchema = new mongoose.Schema<MO_ReactionRoles>({
	guildId: { type: String, required: true },
	channelId: { type: String, required: true },
	messageId: { type: String, required: true },
	reactions: {
		type: [
			{
				emoji: { type: String, required: true },
				roleIds: { type: [String], required: true }
			}
		],
		default: []
	}
});

const DB_ReactionRoles = mongoose.model<MO_ReactionRoles>('KBot2_ReactionRoles', ReactionRoleSchema);

const Revalidate = async () => {};

export default DB_ReactionRoles;
export { ReactionRoleSchema, Revalidate };
