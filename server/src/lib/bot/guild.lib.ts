import DB_Guilds             from "@server/mongodb/DB_Guilds";
import { BC }                from "@server/lib/System.Lib";
import {
	AllowedThreadTypeForNewsChannel,
	Guild,
	GuildTextThreadCreateOptions,
	MessageCreateOptions,
	MessagePayload,
	NewsChannel,
	PermissionFlagsBits
}                            from "discord.js";
import { IDiscordGuildData } from "@shared/types/discord";

// update a guild or add a new one
const UpdateGuild = async( dicordGuild : Guild ) => {
	try {
		if ( !await DB_Guilds.exists( { guildId: dicordGuild.id.toString() } ) ) {
			await DB_Guilds.create( {
				guildId: dicordGuild.id,
				accountIds: dicordGuild.members.cache.filter( R => R.permissions.has( PermissionFlagsBits.Administrator ) ).map( R => R.id.toString() ),
				guildData: dicordGuild.toJSON()
			} );
			SystemLib.LogWarning( "bot", `New Guild added to Database:${ BC( "Cyan" ) }`, dicordGuild.name, ` | ID:`, dicordGuild.id );
		}
		else {
			await DB_Guilds.findOneAndUpdate( { guildId: dicordGuild.id }, {
				accountIds: dicordGuild.members.cache.filter( R => R.permissions.has( PermissionFlagsBits.Administrator ) ).map( R => R.id.toString() ),
				guildData: dicordGuild.toJSON()
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
	private readonly guildId;
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

	public async getGuildData() : Promise<IDiscordGuildData | undefined> {
		try {
			const DBData = ( await DB_Guilds.findById( { guildId: this.guildId } ) )!;
			return DBData.guildData;
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

	private getChannel( channelId : string ) {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.channels.cache.find( channel => channel.id === channelId );
		}
		return undefined;
	}

	public chatChannel( channelId : string ) {
		const channel = this.getChannel( channelId );
		if ( channel && channel.isTextBased() ) {
			return channel;
		}
		return undefined;
	}

	public voiceChannel( channelId : string ) {
		const channel = this.getChannel( channelId );
		if ( channel && channel.isVoiceBased() ) {
			return channel;
		}
		return undefined;
	}

	public forumChannel( channelId : string ) {
		const channel = this.getChannel( channelId );
		if ( channel instanceof NewsChannel ) {
			return channel;
		}
		return undefined;
	}

	public textChannel( channelId : string ) {
		const channel = this.getChannel( channelId );
		if ( channel && channel.isTextBased() ) {
			return channel;
		}
		return undefined;
	}

	public user( userId : string ) {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.members.cache.find( member => member.id === userId );
		}
		return undefined;
	}

	public role( userId : string ) {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.roles.cache.find( member => member.id === userId );
		}
		return undefined;
	}

	public allTextChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.channels.cache.filter( R => R.isTextBased );
		}
		return [];
	}

	public allVoiceChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.channels.cache.filter( R => R.isVoiceBased );
		}
		return [];
	}

	public allForumChannels() {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.channels.cache.filter( R => R.isThread );
		}
		return [];
	}

	public allRoles() {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.roles.cache.filter( () => true );
		}
		return [];
	}

	public allMember() {
		const guild = this.getGuild;
		if ( guild ) {
			return guild.roles.cache.filter( () => true );
		}
		return [];
	}

	public async sendMessageInChannel( opt : { channelId : string, message : string | MessagePayload | MessageCreateOptions } ) : Promise<boolean> {
		const channel = this.textChannel( opt.channelId );
		if ( channel ) {
			return !!( await channel.send( opt.message )
				.catch( () => {
				} ) );
		}
		return false;
	}

	public async sendForumThread( opt : { channelId : string, thread : GuildTextThreadCreateOptions<AllowedThreadTypeForNewsChannel> } ) : Promise<boolean> {
		const channel = this.forumChannel( opt.channelId );
		if ( channel ) {
			return !!( await channel.threads.create( opt.thread )
				.catch( () => {
				} ) );
		}
		return false;
	}

	IsValid() : boolean {
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
			if ( GuildClass.IsValid() ) {
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