import DB_Guilds            from "@server/mongodb/DB_Guilds";
import { BC }               from "@server/lib/System.Lib";
import {
	ChannelType,
	Guild,
	GuildForumThreadCreateOptions,
	MessageCreateOptions,
	MessagePayload,
	PermissionFlagsBits
}                           from "discord.js";
import { DiscordGuildData } from "@shared/types/discord";
import { MO_Guild }         from "@shared/types/MongoDB";

// update a guild or add a new one
const UpdateGuild = async( dicordGuild : Guild ) => {
	try {
		if ( !await DB_Guilds.exists( { guildId: dicordGuild.id.toString() } ) ) {
			await DB_Guilds.create( {
				guildId: dicordGuild.id,
				accountIds: dicordGuild.members.cache.filter( R => R.permissions.has( PermissionFlagsBits.Administrator ) ).map( R => R.id.toString() ),
				guildData: dicordGuild.toJSON(),
				isInGuild: true
			} );
			SystemLib.LogWarning( "bot", `New Guild added to Database:${ BC( "Cyan" ) }`, dicordGuild.name, ` | ID:`, dicordGuild.id );
		}
		else {
			await DB_Guilds.findOneAndUpdate( { guildId: dicordGuild.id }, {
				accountIds: dicordGuild.members.cache.filter( R => R.permissions.has( PermissionFlagsBits.Administrator ) ).map( R => R.id.toString() ),
				guildData: dicordGuild.toJSON(),
				isInGuild: true
			} );
		}
	}
	catch ( e ) {
		if ( e instanceof Error ) {
			SystemLib.LogError( "bot", `Error while updating or create guild: ${ BC( "Red" ) }`, e.message );
		}
	}
};

class DiscordGuild {
	public readonly guildId;
	private Valid = false;
	private guild : Guild | undefined;
	private DbId = "";


	private constructor( guildId : string ) {
		this.guildId = guildId;
	}

	private async InitializeGuild() {
		const Guild = await DB_Guilds.findOne( { guildId: this.guildId, isInGuild: true } );
		this.guild = DiscordBot.guilds.cache.find( guild => guild.id === this.guildId );
		if ( Guild && this.guild ) {
			this.DbId = Guild._id.toString();
			this.Valid = this.DbId !== "";
		}
	}

	static async ConstructGuild( guildId : string ) : Promise<DiscordGuild> {
		const GuildClass = new DiscordGuild( guildId );
		await GuildClass.InitializeGuild();
		return GuildClass;
	}

	public async getGuildData() : Promise<DiscordGuildData | undefined> {
		try {
			const DBData = ( await DB_Guilds.findOne( { guildId: this.guildId } ) )!;
			return DBData.guildData;
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "bot", `Error while getting guild data: ${ BC( "Red" ) }`, e.message );
			}
		}
	}

	public async getGuildDb() : Promise<MO_Guild | undefined> {
		try {
			const DBData = await DB_Guilds.findOne( { guildId: this.guildId } )!;
			return DBData || undefined;
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "bot", `Error while getting guild data: ${ BC( "Red" ) }`, e.message );
			}
		}
	}

	public get getGuild() : Guild | undefined {
		return this.guild;
	}

	public async userHasPermission( userId : string ) : Promise<boolean> {
		const DB = await this.getGuildDb();
		if ( DB?.isInGuild && DB.accountIds.includes( userId ) ) {
			return true;
		}
		return false;
	}

	private async getChannel( channelId : string ) {
		const guild = this.getGuild;
		if ( guild && channelId ) {
			return guild.channels.fetch( channelId ).catch( () => {
			} );
		}
		return undefined;
	}

	public async chatChannel( channelId : string ) {
		const channel = await this.getChannel( channelId );
		if ( channel && channel.isTextBased() ) {
			return channel;
		}
		return undefined;
	}

	public async voiceChannel( channelId : string ) {
		const channel = await this.getChannel( channelId );
		if ( channel && channel.isVoiceBased() ) {
			return channel;
		}
		return undefined;
	}

	public async forumChannel( channelId : string ) {
		const channel = await this.getChannel( channelId );
		if ( channel && channel.type === ChannelType.GuildForum ) {
			return channel;
		}
		return undefined;
	}

	public async textChannel( channelId : string ) {
		const channel = await this.getChannel( channelId );
		if ( channel && channel.isTextBased() ) {
			return channel;
		}
		return undefined;
	}

	public async user( userId : string ) {
		const guild = this.getGuild;
		if ( guild && userId ) {
			return await guild.members.fetch( userId ).catch( () => {
			} );
		}
		return undefined;
	}

	public async role( roleId : string ) {
		const guild = this.getGuild;
		if ( guild && roleId ) {
			return await guild.roles.fetch( roleId ).catch( () => {
			} );
		}
		return undefined;
	}

	public async allTextChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return ( await guild.channels.fetch().catch( () => {
			} ) )?.filter( R => R?.isTextBased );
		}
		return [];
	}

	public async allVoiceChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return ( await guild.channels.fetch().catch( () => {
			} ) )?.filter( R => R?.isVoiceBased );
		}
		return [];
	}

	public async allForumChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return ( await guild.channels.fetch().catch( () => {
			} ) )?.filter( R => R?.isThread );
		}
		return [];
	}

	public async allRoles() {
		const guild = this.getGuild;
		if ( guild ) {
			return await guild.roles.fetch().catch( () => {
			} );
		}
		return [];
	}

	public async allMember() {
		const guild = this.getGuild;
		if ( guild ) {
			return await guild.roles.fetch().catch( () => {
			} );
		}
		return [];
	}

	public async sendMessageInChannel( opt : { channelId : string, message : string | MessagePayload | MessageCreateOptions } ) : Promise<boolean> {
		const channel = await this.textChannel( opt.channelId );
		if ( channel ) {
			return !!( await channel.send( opt.message )
				.catch( () => {
				} ) );
		}
		return false;
	}

	public async sendForumThread( opt : { channelId : string, thread : GuildForumThreadCreateOptions } ) : Promise<boolean> {
		const channel = await this.forumChannel( opt.channelId );
		if ( channel ) {
			return !!( await channel.threads.create( opt.thread )
				.catch( () => {
				} ) );
		}
		return false;
	}

	get IsValid() : boolean {
		return this.Valid;
	}
}

class DiscordGuildManagerClass {
	private Guilds = new Map<string, DiscordGuild>();

	public RemoveGuild( guildId : string ) : void {
		if ( this.Guilds.has( guildId ) ) {
			this.Guilds.delete( guildId );
		}
	}

	public async GetGuild( guildId : string ) : Promise<DiscordGuild | null> {
		if ( this.Guilds.has( guildId ) ) {
			return this.Guilds.get( guildId )!;
		}
		else {
			const GuildClass = await DiscordGuild.ConstructGuild( guildId );
			if ( GuildClass.IsValid ) {
				this.Guilds.set( guildId, GuildClass );
				return GuildClass;
			}
		}
		return null;
	}
}

if ( !global.DiscordGuildManager ) {
	global.Cached_DiscordGuildManager = new DiscordGuildManagerClass();
}
const DiscordGuildManager = global.Cached_DiscordGuildManager;

export {
	DiscordGuildManager,
	DiscordGuildManagerClass,
	DiscordGuild,
	UpdateGuild
};