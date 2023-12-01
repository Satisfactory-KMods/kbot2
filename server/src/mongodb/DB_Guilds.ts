import { MO_Guild, MO_GuildOptions, MO_PatreonOptions } from '@shared/types/MongoDB';
import * as mongoose from 'mongoose';

const GuildOptionSchema = new mongoose.Schema<MO_GuildOptions>({
	suggestionChannelId: { type: String, default: '' },
	bugChannelId: { type: String, default: '' },
	modsAnnounceHiddenMods: { type: Boolean, default: false },
	modsUpdateAnnouncement: { type: Boolean, default: false },
	blacklistedMods: { type: [String], default: [] },
	ficsitUserIds: { type: [String], default: [] },
	modToRole: {
		type: [
			{
				modRef: { type: String, default: '' },
				roleId: { type: String, default: '' }
			}
		]
	},
	chatCommandPrefix: { type: String, default: '.' },
	changelogForumId: { type: String, default: '' },
	updateTextChannelId: { type: String, default: '' },
	defaultPingRole: { type: String, default: '0' },
	RolePingRules: {
		type: [
			{
				roleId: { type: String, required: true },
				modRefs: { type: [String], required: true }
			}
		],
		default: []
	}
});

const PatreonOptionSchema = new mongoose.Schema<MO_PatreonOptions>({
	pingRoles: { type: [String], default: [] },
	announcementChannel: { type: String, default: '0' },
	changelogForum: { type: String, default: '0' },
	patreonReleaseText: { type: String, default: '' }
});

const GuildSchema = new mongoose.Schema<MO_Guild>(
	{
		guildId: { type: String, required: true, unique: true },
		isInGuild: { type: Boolean, default: false },
		accountIds: { type: [String], default: [] },
		guildData: { type: {}, default: {} },
		patreonOptions: { type: PatreonOptionSchema },
		options: {
			type: GuildOptionSchema,
			default: {
				suggestionChannelId: '',
				bugChannelId: '',
				chatCommandPrefix: '.',
				changelogForumId: '',
				updateTextChannelId: '',
				RolePingRules: [],
				blacklistedMods: [],
				ficsitUserIds: [],
				modsUpdateAnnouncement: false
			}
		}
	},
	{ timestamps: true }
);

const DB_Guilds = mongoose.model<MO_Guild>('KBot2_Guild', GuildSchema);

const Revalidate = async () => {
	//await DB_Guilds.updateMany();
};

export default DB_Guilds;
export { GuildOptionSchema, GuildSchema, Revalidate };
