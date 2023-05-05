import {
	gql,
	GraphQLClient
}                              from "graphql-request";
import { MO_Mod }              from "@shared/types/MongoDB";
import DB_Mods                 from "@server/mongodb/DB_Mods";
import { JobOptions }          from "@server/tasks/TaskManager";
import DB_Guilds               from "@server/mongodb/DB_Guilds";
import DB_ModUpdates           from "@server/mongodb/DB_ModUpdates";
import { DiscordGuildManager } from "@server/lib/bot/guild.lib";
import { createEmbed }         from "@server/lib/bot/embed.lib";
import {
	BuildStringGroup,
	GroupToString
}                              from "@server/lib/bot/stringGrouper.lib";
import { ThreadChannel }       from "discord.js";

export interface ModGraphQLRequest {
	getMods : GetMods;
}

export interface GetMods {
	mods : Omit<MO_Mod, "_id" | "__v">[];
	count : number;
}


const client = new GraphQLClient( "https://api.ficsit.app/v2/query", { headers: {} } );
const GraphQuery = ( Offset : number ) => {
	return gql`
        query {
            getMods( filter: { limit: 100, offset: ${ Offset } } ) {
                mods {
                    versions( filter: {order_by: created_at} ) { version, sml_version, id, created_at, updated_at, changelog, hash  },
                    mod_reference,
                    id,
                    name,
                    logo,
                    short_description,
                    source_url,
                    creator_id,
                    views,
                    downloads,
                    updated_at,
                    created_at,
                    last_version_date,
                    hidden,
                    authors{user_id, mod_id, role, user{id, username}},
                    latestVersions {alpha{version, sml_version, id, created_at, updated_at, changelog, hash}, beta{version, sml_version, id, created_at, updated_at, changelog, hash}, release{version, sml_version, id, created_at, updated_at, changelog, hash} }
                },
                count
            }
        }
	`;
};

const JobOptions : JobOptions = {
	DisableInitSync: true,
	Interval: 60000 * 5, // 5 minutes
	JobName: "FicsitQuery",
	Task: async() => {
		try {
			const Mods : Omit<MO_Mod, "_id" | "__v">[] = [];
			if ( !SystemLib.IsDevMode ) {
				let MaxReached = false;
				let Offset = 0;
				SystemLib.LogWarning( "tasks", "Start Update Mods!" );
				while ( !MaxReached ) {
					try {
						const Data : ModGraphQLRequest = await client.request( GraphQuery( Offset ) );

						for ( const Mod of Data.getMods.mods ) {
							await DB_Mods.findOneAndRemove( { id: Mod.id } );
							await DB_Mods.create( Mod );
							Mods.push( Mod );
						}

						Offset += 100;
						MaxReached = Data.getMods.count < Offset;
					}
					catch ( e ) {
						if ( e instanceof Error ) {
							SystemLib.LogError( "api", e.message );
						}
						MaxReached = true;
					}
				}
				SystemLib.LogWarning( "tasks", "Update Mods Finished!" );
			}
			global.modCache = await DB_Mods.find();

			for await ( const guild of DB_Guilds.find( { "options.modsUpdateAnnouncement": true, isInGuild: true } ) ) {
				const guildClass = await DiscordGuildManager.GetGuild( guild.guildId );
				if ( guildClass?.IsValid ) {
					const threadChannel = await guildClass.forumChannel( guild.options.changelogForumId || "0" );
					const annoucementChannel = await guildClass.textChannel( guild.options.updateTextChannelId || "0" );
					SystemLib.LogWarning( "mod update task", guildClass.getGuild?.name, !!threadChannel, !!annoucementChannel );

					if ( annoucementChannel || threadChannel ) {
						SystemLib.LogWarning( "tasks", guild.options );
						for await ( const mod of await DB_Mods.find( {
							creator_id: guild.options.ficsitUserIds
						} ) ) {
							SystemLib.LogWarning( "tasks", mod.name );

							if ( !guild.options.blacklistedMods?.includes( mod.mod_reference ) ) {
								SystemLib.LogWarning( "tasks", mod.mod_reference );
								const modDocument = await DB_ModUpdates.findOne( {
									guildId: guild.guildId,
									modRef: mod.mod_reference
								} );

								if ( !modDocument ) {
									SystemLib.LogWarning( "tasks", "create" + mod.mod_reference );
									await DB_ModUpdates.create( {
										guildId: guild.guildId,
										modRef: mod.mod_reference,
										hash: mod.versions[ 0 ]?.hash || "0",
										lastUpdate: new Date(),
										lastMessageId: "0"
									} );
									continue;
								}

								if ( mod.versions.length <= 0 ) {
									SystemLib.LogWarning( "tasks", mod.versions );
									continue;
								}

								SystemLib.LogWarning( "tasks", modDocument.hash, mod.versions[ 0 ].hash );
								if ( modDocument.hash !== mod.versions[ 0 ].hash ) {
									let changelogId : string | undefined = undefined;
									if ( threadChannel ) {
										const tag = threadChannel.availableTags.find( e => e.name === mod.mod_reference );
										const appliedTags = tag ? [ tag.id ] : [];

										const grouped = BuildStringGroup( mod.versions[ 0 ].changelog );
										SystemLib.LogWarning( "tasks", "send", grouped );
										if ( grouped && grouped.length > 0 ) {
											const name = `${ mod.name } - v.${ mod.versions[ 0 ].version }`.substring( 0, 99 );
											const content = GroupToString( grouped.splice( 1, 1 )![ 0 ] );
											const thread : ThreadChannel | undefined = await threadChannel.threads.create( {
												name,
												message: { content },
												appliedTags,
												autoArchiveDuration: 60
											} );

											changelogId = thread?.id;

											SystemLib.LogWarning( "tasks", !!thread, grouped.length );
											if ( thread && grouped.length > 0 ) {
												for ( const message of grouped ) {
													if ( message.Data.length > 0 ) {
														const content = GroupToString( message );
														await thread.send( { content } );
													}
												}
											}
										}
									}

									const embed = createEmbed( {
										author: {
											name: mod.name,
											iconURL: mod.logo
										},
										thumbnail: mod.logo,
										title: `v.${ mod.versions[ 0 ].version } - ${ mod.name }`,
										fields: [
											{
												name: mod.versions[ 0 ].changelog !== "" ? mod.versions[ 0 ].changelog.split( /\r?\n/ )[ 0 ].substring( 0, 255 ) : "...",
												value: `Now available on SMM and SMR \n\n For any suggestion please use <#${ guild.options.suggestionChannelId }> \n And for bug reports <#${ guild.options.bugChannelId }>.`
											},
											{
												name: "Changelog",
												value: changelogId ? `<#${ changelogId }>` : `[Click here](https://ficsit.app/mod/${ mod.mod_reference }/version/${ mod.versions[ 0 ].id })`,
												inline: true
											},
											{
												name: "Mod Page",
												value: `[Click here](https://ficsit.app/mod/${ mod.mod_reference })`,
												inline: true
											},
											{
												name: "All our Mods",
												value: `[Click here](https://ficsit.app/user/${ guild.options.ficsitUserIds[ 0 ] })`,
												inline: true
											}
										]
									} );

									const role = await guildClass.role( guild.options.RolePingRules?.find( r => r.modRefs.includes( mod.mod_reference ) )?.roleId || ( guild.options.defaultPingRole?.length > 0 ? guild.options.defaultPingRole : "0" ) );
									let roleId = "0";
									if ( role ) {
										roleId = role.id;
									}

									let lastMessageId = "0";
									SystemLib.LogWarning( "tasks", "send", !!embed, !!annoucementChannel );
									if ( embed && annoucementChannel ) {
										const msg = await annoucementChannel.send( {
											embeds: [ embed ],
											content: `${ roleId === "0" ? "@everyone" : "<@&" + roleId + ">" } new mod update has been released!\n\n`
										} );

										if ( msg ) {
											lastMessageId = msg.id;
										}

										await DB_ModUpdates.findByIdAndUpdate( modDocument._id, {
											hash: mod.versions[ 0 ].hash,
											lastUpdate: new Date(),
											lastMessageId
										} );
									}
								}
							}
						}
					}
				}
			}
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.DebugLog( "fetching", e.message, e );
			}
		}
	}
};

export default JobOptions;
