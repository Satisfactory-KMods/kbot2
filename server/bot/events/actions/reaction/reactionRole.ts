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
import { botClient } from '~/server/bot/bot';
import type { GuildReactionRole } from '~/server/bot/utils/guild';
import { log } from '~/utils/logger';
import { DiscordGuildManager } from '../../../utils/guildManager';

async function toggleRole(
	member: GuildMember,
	role: Role,
	{ skipMessage = false, force = undefined }: { skipMessage?: boolean; force?: boolean } = {}
) {
	if (member.user.bot) return;

	try {
		const hasRole =
			typeof force === 'undefined'
				? member.roles.cache.some((r) => {
						return r.id === role.id;
					})
				: force;

		hasRole
			? await member.roles.remove(role).catch((e) => {
					if (typeof force !== 'undefined') {
						throw e;
					}
				})
			: await member.roles.add(role).catch((e) => {
					if (typeof force !== 'undefined') {
						throw e;
					}
				});
		if (!skipMessage) {
			await member
				.send(`Role ${role.name} was ${hasRole ? 'removed' : 'added'}`)
				.catch(() => {});
		}
		log(
			'bot',
			`Role ${role.name} was ${hasRole ? 'removed' : 'added'} for user ${member.user.username}`
		);
	} catch (e: any) {
		log('bot-error', e.message);
	}
}

export async function handleReactionRole(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser
) {
	try {
		if (reaction.message.inGuild() && !user.bot) {
			const guild = await DiscordGuildManager.getGuild(reaction.message.guildId);
			if (guild.isValid()) {
				const reactionRole = guild.config.reactionRoles.find((r) => {
					return r.message_id === reaction.message.id;
				});

				if (reactionRole) {
					await reaction.users.remove(user.id);
					const rule = reactionRole.emojies.find((v) => {
						return v.emoji.trim() === reaction.emoji.name?.trim();
					});
					const message = reaction.message;
					if (rule && message) {
						const member = await guild.guildMember(user.id);
						for (const roleId of rule.role_ids) {
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

export async function startUpReactionRoles() {
	await Promise.all(
		botClient.guilds.cache.map(async (g) => {
			const guild = await DiscordGuildManager.getGuild(g.id);
			if (guild.isValid()) {
				const reactionRoles = guild.config.reactionRoles;
				for (const data of reactionRoles) {
					const message = await guild.message(data.message_id, data.channel_id);
					if (message) {
						// toggle for all users the reaction
						for (const reaction of message.reactions.cache.map((e) => {
							return e;
						})) {
							const rule = data.emojies.find((v) => {
								return v.emoji.trim() === reaction.emoji.name?.trim();
							});
							if (rule) {
								for (const roleId of rule.role_ids) {
									const role = await guild.role(roleId);
									if (role) {
										const users = await reaction.users.fetch();
										for (const user of users.map((u) => {
											return u;
										})) {
											const member = await guild.guildMember(
												user.id as string
											);
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
		})
	);
}

async function reapplyReactionRoles(message: Message<true>, reactionData: GuildReactionRole) {
	// remove old reactions
	for (const reaction of message.reactions.cache.values()) {
		if (
			reactionData.emojies.find((r) => {
				return isEqual(r.emoji, reaction.emoji.name);
			}) === undefined
		) {
			await reaction.remove();
		}
	}

	// add new reactions
	await Promise.all(
		reactionData.emojies.map(async (reaction) => {
			try {
				await message.react(reaction.emoji);
			} catch (e: any) {
				log('bot-error', e.message);
			}
		})
	);
}
