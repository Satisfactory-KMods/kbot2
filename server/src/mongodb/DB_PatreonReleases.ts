import { MO_PatreonReleases } from '@shared/types/MongoDB';
import mongoose from 'mongoose';

const ModDbSchema = new mongoose.Schema<MO_PatreonReleases>(
	{
		guildId: { type: String, required: false },
		changelogContent: { type: String, required: false },
		modRef: { type: String, required: false },
		version: { type: String, required: false }
	},
	{ timestamps: true, strict: false }
);

export default mongoose.model<MO_PatreonReleases>('kbot2_PatreonReleases', ModDbSchema);
export { ModDbSchema };
