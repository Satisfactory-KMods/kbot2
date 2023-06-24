import {
	MW_Auth,
	MW_AuthGuild,
	MW_AuthGuild_Leg
} from "@server/lib/Express.Lib";
import { BC } from "@server/lib/System.Lib";
import { createEmbed } from "@server/lib/bot/embed.lib";
import { DiscordGuildManager } from "@server/lib/bot/guild.lib";
import {
	BuildStringGroup,
	GroupToString
} from "@server/lib/bot/stringGrouper.lib";
import DB_Mods from "@server/mongodb/DB_Mods";
import DB_PatreonReleases from "@server/mongodb/DB_PatreonReleases";
import { auth_getGuilds } from "@server/trpc/routings/auth/getGuilds";
import { guild_channels } from "@server/trpc/routings/guild/channels";
import { guild_chatCommands } from "@server/trpc/routings/guild/chatCommands";
import { guild_modUpdateAnnoucment } from "@server/trpc/routings/guild/modUpdateAnnoucment";
import { guild_patreon } from "@server/trpc/routings/guild/patreonSettings";
import { guild_reactionRoles } from "@server/trpc/routings/guild/reactionRoles";
import { guild_roles } from "@server/trpc/routings/guild/role";
import { guild_validate } from "@server/trpc/routings/guild/validate";
import { public_createAccount } from "@server/trpc/routings/public/createAccount";
import { public_login } from "@server/trpc/routings/public/login";
import { public_checkToken } from "@server/trpc/routings/public/patreon";
import { public_patreon } from "@server/trpc/routings/public/patreonDownload";
import { public_resetPassword } from "@server/trpc/routings/public/resetPassword";
import { public_validate } from "@server/trpc/routings/public/validate";
import {
	createContext,
	router
} from "@server/trpc/trpc";
import { messageTextLimit } from "@shared/Default/discord";
import * as trpcExpress from "@trpc/server/adapters/express";
import { ThreadChannel } from "discord.js";
import {
	Request,
	Response
} from "express";
import fileUpload from "express-fileupload";
import fs from "fs";
import path from "path";
import z from "zod";


const publicRouter = router( {
	checktoken: public_checkToken,
	validate: public_validate,
	login: public_login,
	register: public_createAccount,
	resetpassword: public_resetPassword,
	patreon: public_patreon
} );
const authRouter = router( {
	getguilds: auth_getGuilds
} );
const guildRouter = router( {
	reactionroles: guild_reactionRoles,
	validate: guild_validate,
	chatcommands: guild_chatCommands,
	modupdates: guild_modUpdateAnnoucment,
	channels: guild_channels,
	roles: guild_roles,
	patreon: guild_patreon
} );


SystemLib.Log( "start", "register TRCP on", BC( "Red" ), "/api/v2/*" );
Api.use( "/api/v2/public", trpcExpress.createExpressMiddleware( {
	router: publicRouter,
	createContext
} ) );
Api.use( "/api/v2/auth", MW_Auth, trpcExpress.createExpressMiddleware( {
	router: authRouter,
	createContext
} ) );
Api.use( "/api/v2/guild", MW_AuthGuild, trpcExpress.createExpressMiddleware( {
	router: guildRouter,
	createContext
} ) );


Api.get( "/api/v1/mod/:modRef", async( req : Request, res : Response ) => {
	const { modRef } = req.params;
	if ( modRef ) {
		if ( modRef.includes(',') ) {
			const mods = await DB_Mods.find( { mod_reference: modRef.split(',') } );
			if ( mods?.length > 0 ) { 
				return res.status( 200 ).json( { success: true, mods } );
			}
			return res.status( 401 ).json( { success: false, message: "Invalid modRefs or empty array" } );
		}
		const mod = await DB_Mods.findOne( { mod_reference: modRef } );
		if ( mod ) {
			return res.status( 200 ).json( { success: true, mods: [mod] } );
		}
	}
	return res.status( 401 ).json( { success: false, message: "Invalid modRef" } );
} );

Api.post( "/api/v1/mod", async( req : Request, res : Response ) => {
	const { modRefs } = req.body as Partial<{modRefs: string[]}>;
	if ( modRefs && Array.isArray( modRefs ) ) {
		const mods = await DB_Mods.find( { mod_reference: modRefs } );
		if ( mods?.length > 0 ) { 
			return res.status( 200 ).json( { success: true, mods } );
		}
	}
	return res.status( 401 ).json( { success: false, message: "Invalid modRefs or empty array" } );
} );


Api.get( "/api/v2/download/:downloadId", async( req : Request, res : Response ) => {
	const { downloadId } = req.params;
	if ( downloadId && global.validDownloadUrls ) {
		const informationIdx = validDownloadUrls.findIndex( e => e.downloadId === downloadId );
		if ( validDownloadUrls[ informationIdx ] && validDownloadUrls[ informationIdx ].expiresAt.valueOf() >= Date.now() ) {
			const information = validDownloadUrls.splice( informationIdx, 1 )[ 0 ];
			const patreonDocument = await DB_PatreonReleases.findById( information.file );
			if ( patreonDocument ) {
				const file = path.join( __MountDir, "patreon", `${ patreonDocument._id }.zip` );
				if ( fs.existsSync( file ) ) {
					return res.status( 200 ).download( file );
				}
			}
		}
	}
	return res.status( 401 ).json( { success: false, message: "This download url is invalid or has he already used" } );
} );


Api.post( "/api/v1/upload/patreon", MW_AuthGuild_Leg, async( req : Request, res : Response ) => {
	const schema = z.object( {
		guildId: z.string().min( 5 ),
		modRef: z.string().min( 1 ),
		changelogContent: z.string().min( 5 ),
		version: z.string().min( 2 )
	} );
	const { guildId, modRef, changelogContent, version } = req.body;
	const post = { guildId, modRef, changelogContent, version };
	const file = req.files?.file;

	try {
		const guild = await DiscordGuildManager.GetGuild( post.guildId );
		const mod = await DB_Mods.findOne( { mod_reference: modRef } );
		if ( !mod ) {
			return res.status( 200 ).json( { success: false, message: "Mod cannot found!" } );
		}
		if ( schema.parse( post ) && file && guild ) {
			const { patreonOptions } = ( await guild.getGuildDb() )!;
			const releaseDocument = new DB_PatreonReleases();

			releaseDocument.changelogContent = post.changelogContent;
			releaseDocument.version = post.version;
			releaseDocument.modRef = post.modRef;
			releaseDocument.guildId = post.guildId;

			if ( await releaseDocument.save() ) {
				!fs.existsSync( path.join( __MountDir, "patreon" ) ) && fs.mkdirSync( path.join( __MountDir, "patreon" ), { recursive: true } );
				await ( file as fileUpload.UploadedFile ).mv( path.join( __MountDir, "patreon", `${ releaseDocument._id }.zip` ) );

				const threadChannel = await guild.forumChannel( patreonOptions.changelogForum );
				if ( threadChannel ) {
					const tag = threadChannel.availableTags.find( e => e.name === mod.mod_reference );
					const appliedTags = tag ? [ tag.id ] : [];

					const grouped = BuildStringGroup( changelogContent, messageTextLimit );
					if ( grouped && grouped.length > 0 ) {
						const name = `${ mod.name } - v.${ version }`.substring( 0, 99 );
						const content = GroupToString( grouped.splice( 0, 1 )![ 0 ] );
						const thread : ThreadChannel | undefined = await threadChannel.threads.create( {
							name,
							message: { content },
							appliedTags,
							autoArchiveDuration: 60
						} );

						if ( thread && grouped.length > 0 ) {
							for ( const message of grouped ) {
								if ( message.Data.length > 0 ) {
									const content = GroupToString( message );
									await thread.send( { content } );
								}
							}
						}

						const annoucementChannel = await guild.textChannel( patreonOptions.announcementChannel );
						if ( annoucementChannel ) {
							const embed = createEmbed( {
								author: {
									name: mod.name,
									iconURL: mod.logo
								},
								thumbnail: mod.logo,
								title: "Download now!",
								url: `${ process.env.BASE_URL }download/${ releaseDocument._id }`
							} );
							if ( embed ) {
								await annoucementChannel.send( {
									embeds: [ embed ],
									content: `${ patreonOptions.pingRoles.map( e => `<@&${ e }>` ).join( ", " ) }\n\n${ patreonOptions.patreonReleaseText.replaceAll( "{changelogmessage}", thread.id.toString() ) }`.substring( 0, messageTextLimit - 1 )
								} );
							}
						}
					}
				}

				return res.status( 200 ).json( { success: true, message: "Upload success" } );
			}
		}
	}
	catch ( e ) {
		console.log( e );
	}
	res.sendStatus( 201 );
} );

export type PublicRouter = typeof publicRouter;
export type AuthRouter = typeof authRouter;
export type GuildRouter = typeof guildRouter;