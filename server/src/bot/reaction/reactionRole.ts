import {
	Events,
	GuildMember,
	Role
}                       from "discord.js";
import {
	DiscordGuildManager,
	reapplyReactionRoles
}                       from "@server/lib/bot/guild.lib";
import DB_ReactionRole  from "@server/mongodb/DB_ReactionRoles";
import DB_ReactionRoles from "@server/mongodb/DB_ReactionRoles";

const toggleRole = async( member : GuildMember, role : Role ) => {
	if ( !member.user.bot ) {
		try {
			const hasRole = member.roles.cache.find( r => r.id === role.id ) !== undefined;
			hasRole ? await member.roles.remove( role ) : await member.roles.add( role );
			await member.send( `Role ${ role.name } was ${ hasRole ? "removed" : "added" }` ).catch( () => {
			} );
			SystemLib.Log( "bot-roles", `Role ${ role.name } was ${ hasRole ? "removed" : "added" } for user ${ member.user.username }` );
		}
		catch ( e ) {
			if ( e instanceof Error ) {
				SystemLib.LogError( "bot-role", e.message );
			}
		}
	}
};

DiscordBot.on( Events.MessageReactionAdd, async( reaction, user ) => {
	try {
		if ( reaction.message.inGuild() && !user.bot ) {
			const guild = await DiscordGuildManager.GetGuild( reaction.message.guildId as string );
			if ( guild?.IsValid ) {
				const reactionRole = await DB_ReactionRole.findOne( {
					guildId: reaction.message.guildId,
					messageId: reaction.message.id
				} );
				if ( reactionRole ) {
					await reaction.users.remove( user.id );
					const rule = reactionRole.reactions.find( v => v.emoji.clearWs() === reaction.emoji.name?.clearWs() );
					const message = reaction.message;
					if ( rule && message ) {
						const member = await guild.guildMember( user.id as string );
						for ( const roleId of rule.roleIds ) {
							const role = await guild.role( roleId );
							if ( member && role ) {
								await toggleRole( member, role );
							}
						}
					}
				}
			}
		}
	}
	catch ( e ) {
		if ( e instanceof Error ) {
			SystemLib.LogError( "bot", e.message );
		}
	}
} );


const startUp = async() => {
	for await ( const reactionDocument of DB_ReactionRoles.find() ) {
		const guild = await DiscordGuildManager.GetGuild( reactionDocument.guildId );
		if ( guild && guild.IsValid ) {
			const message = await guild.message( reactionDocument.messageId, reactionDocument.channelId );
			if ( message ) {
				// toggle for all users the reaction
				for ( const reaction of message.reactions.cache.map( e => e ) ) {
					const rule = reactionDocument.reactions.find( v => v.emoji.clearWs() === reaction.emoji.name?.clearWs() );
					if ( rule ) {
						for ( const roleId of rule.roleIds ) {
							const role = await guild.role( roleId );
							if ( role ) {
								const users = await reaction.users.fetch();
								for ( const user of users.map( u => u ) ) {
									const member = await guild.guildMember( user.id as string );
									if ( member ) {
										await reaction.users.remove( member.user.id );
										await toggleRole( member, role );
									}
								}
							}
						}
					}
				}

				await reapplyReactionRoles( message, reactionDocument );
			}
		}
	}
};


export {
	startUp
};