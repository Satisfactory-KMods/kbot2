import { MO_Patreon } from '@shared/types/MongoDB';
import mongoose from 'mongoose';

const ModDbSchema = new mongoose.Schema<MO_Patreon>(
	{
		guildId: { type: String, required: false },
		discordId: { type: String, required: false },
		token: { type: String, required: false }
	},
	{ timestamps: true, strict: false }
);

export default mongoose.model<MO_Patreon>('kbot2_Patreon', ModDbSchema);
export { ModDbSchema };
