import { and, eq } from '@kmods/drizzle-pg';
import { pgAggJsonBuildObject } from '@kmods/drizzle-pg/pg-core';
import type {
	GuildMember,
	Message,
	MessageReaction,
	PartialMessageReaction,
	PartialUser,
	Role,
	User
} from 'discord.js';
import isEqual from 'lodash/isEqual';
import { db, scReactionRoles } from '~/server/utils/db/postgres/pg';
import { log } from '~/utils/logger';
import { DiscordGuildManager } from '../../../utils/guildManager';

const toggleRole = async (member: GuildMember, role: Role) => {
	if (!member.user.bot) {
		try {
			const hasRole =
				member.roles.cache.find((r) => {
					return r.id === role.id;
				}) !== undefined;
			hasRole ? await member.roles.remove(role) : await member.roles.add(role);
			await member
				.send(`Role ${role.name} was ${hasRole ? 'removed' : 'added'}`)
				.catch(() => {});
			log(
				'bot',
				`Role ${role.name} was ${hasRole ? 'removed' : 'added'} for user ${member.user.username}`
			);
		} catch (e) {
			if (e instanceof Error) {
				log('bot-error', e.message);
			}
		}
	}
};

export async function handleReactionRole(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser
) {
	try {
		if (reaction.message.inGuild() && !user.bot) {
			const guild = await DiscordGuildManager.getGuild(reaction.message.guildId as string);
			if (guild?.IsValid) {
				const reactionRole = await db
					.select()
					.from(scReactionRoles)
					.where(
						and(
							eq(scReactionRoles.guild_id, reaction.message.guildId),
							eq(scReactionRoles.message_id, reaction.message.id)
						)
					)
					.first();

				if (reactionRole) {
					await reaction.users.remove(user.id);
					const rule = reactionRole.reactions.find((v) => {
						return v.emoji.trim() === reaction.emoji.name?.trim();
					});
					const message = reaction.message;
					if (rule && message) {
						const member = await guild.guildMember(user.id);
						for (const roleId of rule.roleIds) {
							const role = await guild.role(roleId);
							if (member && role) {
								await toggleRole(member, role);
							}
						}
					}
				}
			}
		}
	} catch (e) {
		if (e instanceof Error) {
			log('bot', e.message);
		}
	}
}

export async function startUp() {
	const datas = await db
		.select({
			guildId: scReactionRoles.guild_id,
			datas: pgAggJsonBuildObject(scReactionRoles, { aggregate: true })
		})
		.from(scReactionRoles)
		.groupBy(scReactionRoles.guild_id);
	for await (const reactionDocument of datas) {
		const guild = await DiscordGuildManager.getGuild(reactionDocument.guildId);
		if (guild && guild.IsValid) {
			for (const data of reactionDocument.datas) {
				const message = await guild.message(data.message_id, data.channel_id);
				if (message) {
					// toggle for all users the reaction
					for (const reaction of message.reactions.cache.map((e) => {
						return e;
					})) {
						const rule = data.reactions.find((v) => {
							return v.emoji.trim() === reaction.emoji.name?.trim();
						});
						if (rule) {
							for (const roleId of rule.roleIds) {
								const role = await guild.role(roleId);
								if (role) {
									const users = await reaction.users.fetch();
									for (const user of users.map((u) => {
										return u;
									})) {
										const member = await guild.guildMember(user.id as string);
										if (member) {
											await reaction.users.remove(member.user.id);
											await toggleRole(member, role);
										}
									}
								}
							}
						}
					}

					await reapplyReactionRoles(message, data);
				}
			}
		}
	}
}

async function reapplyReactionRoles(
	message: Message<true>,
	reactionDocument: typeof scReactionRoles.$inferSelect
) {
	// remove and readd reaction
	for (const reaction of message.reactions.cache.values()) {
		if (
			reactionDocument.reactions.find((r) => {
				return isEqual(r.emoji, reaction.emoji.name);
			}) === undefined
		) {
			await reaction.remove();
		}
	}

	for (const reaction of reactionDocument.reactions) {
		try {
			await message.react(reaction.emoji);
		} catch (e: any) {
			log('bot-error', e.message);
		}
	}
}
