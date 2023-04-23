import * as mongoose from "mongoose";
import {
	IMO_Guild,
	IMO_GuildOptions
}                    from "@shared/types/MongoDB";

const GuildOptionSchema = new mongoose.Schema<IMO_GuildOptions>( {
	chatCommandPrefix: { type: String, default: "." },
	changelogForumId: { type: String, default: "" },
	updateTextChannelId: { type: String, default: "" },
	RolePingRules: {
		type: [
			{
				roleId: { type: String, required: true },
				modRefs: { type: [ String ], required: true }
			}
		], default: []
	}
} );

const GuildSchema = new mongoose.Schema<IMO_Guild>( {
	guildId: { type: String, required: true, unique: true },
	accountIds: { type: [ String ], default: [] },
	guildData: { type: {}, default: {} },
	options: {
		type: GuildOptionSchema, default: {
			chatCommandPrefix: ".",
			changelogForumId: "",
			updateTextChannelId: "",
			RolePingRules: []
		}
	}
}, { timestamps: true } );

const DB_Guilds = mongoose.model<IMO_Guild>( "KBot2_Guild", GuildSchema );

const Revalidate = async() => {
	//await DB_Guilds.updateMany();
};

export default DB_Guilds;
export {
	GuildOptionSchema,
	GuildSchema,
	Revalidate
};