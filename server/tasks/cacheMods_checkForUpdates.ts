import { and, eq, inArray, neq } from '@kmods/drizzle-pg';
import {
	getColumnsFromViewOrSubquery,
	now,
	pgAggJsonBuildObject,
	pgAnyValue
} from '@kmods/drizzle-pg/pg-core';
import { gt as semverGt } from 'semver';
import { LOGO } from '~/utils/constant';
import { log } from '~/utils/logger';
import { createEmbed } from '../bot/utils/embed';
import { DiscordGuildManager } from '../bot/utils/guildManager';
import {
	db,
	scGuild,
	scGuildConfiguration,
	scGuildConfigurationFicsitUserIds,
	scModAuthors,
	scModUpdates
} from '../utils/db/postgres/pg';
import { viewMods } from '../utils/db/postgres/views';

export async function checkForModUpdates() {
	const guilds = await db
		.selectDistinctOn([scGuild.guild_id], {
			guild_id: scGuild.guild_id,
			changelog_announce_hidden_mods: pgAnyValue(
				scGuildConfiguration.changelog_announce_hidden_mods
			),
			update_text_channel_id: pgAnyValue(scGuildConfiguration.update_text_channel_id),
			changelog_forum_id: pgAnyValue(scGuildConfiguration.changelog_forum_id),
			default_ping_role: pgAnyValue(scGuildConfiguration.default_ping_role),
			changelog_bug_channel_id: pgAnyValue(scGuildConfiguration.changelog_bug_channel_id),
			changelog_suggestion_channel_id: pgAnyValue(
				scGuildConfiguration.changelog_suggestion_channel_id
			),
			configuration: pgAggJsonBuildObject(scGuildConfiguration, {
				aggregate: true,
				index: 0
			}),
			ficsit_users: pgAggJsonBuildObject(scGuildConfigurationFicsitUserIds, {
				aggregate: true
			}),
			mod_updates: pgAggJsonBuildObject(scModUpdates, { aggregate: true })
		})
		.from(scGuild)
		.innerJoin(scGuildConfiguration, ['guild_id'])
		.innerJoin(scGuildConfigurationFicsitUserIds, ['guild_id'])
		.where(and(eq(scGuild.active, true), neq(scGuildConfiguration.update_text_channel_id, '0')))
		.leftJoin(scModUpdates, ['guild_id'])
		.groupBy(scGuild.guild_id);

	log('tasks', `Check for mod updates started! for ${guilds.length} guilds`);
	for (const { guild_id, ficsit_users, mod_updates, ...configuration } of guilds) {
		if (!ficsit_users.length) continue;
		log('tasks', `Check for guild ${guild_id} started!`);

		const dirtyMods = await db
			.selectDistinctOn([viewMods.mod_reference], getColumnsFromViewOrSubquery(viewMods))
			.from(viewMods)
			.innerJoin(scModAuthors, eq(viewMods.mod_id, scModAuthors.mod_id))
			.where(
				and(
					inArray(
						scModAuthors.user_id,
						ficsit_users.map((u) => {
							return u.ficsit_user_id;
						})
					),
					!configuration.changelog_announce_hidden_mods
						? eq(viewMods.hidden, false)
						: undefined
				)
			)
			.then((mods) => {
				return mods.filter((mod) => {
					const exists = mod_updates.find((update) => {
						return update.mod_reference === mod.mod_reference;
					});

					if (!exists) {
						return true;
					}

					if (!mod.last_version) {
						return false;
					}

					if (
						mod.versions.some(({ version }) => {
							return semverGt(version, exists.version);
						})
					) {
						return true;
					}

					return false;
				});
			})
			.then((mods) => {
				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let i = 0; i < mods.length; i++) {
					const mod = mods[i];
					// we going to make sure that we really find the latest version
					mod.last_version = mod.versions.reduce((acc, cur) => {
						if (!cur) return acc;
						if (!acc) return cur ?? null;

						if (semverGt(cur.version, acc.version)) {
							return cur;
						}

						return acc;
					}, mod.last_version);
				}
				return mods;
			});

		log('tasks', `Check for guild ${guild_id} has found ${dirtyMods.length} mods!`);

		for (const mod of dirtyMods) {
			const exists = mod_updates.find((update) => {
				return update.mod_reference === mod.mod_reference;
			});

			const announce =
				!!exists &&
				!!mod.last_version &&
				semverGt(mod.last_version.version, exists.version);

			if (!!exists && !mod.last_version) {
				return;
			}

			await db
				.transaction(async (trx) => {
					await trx
						.insert(scModUpdates)
						.values({
							guild_id,
							announced_at: now(),
							updated_at: now(),
							mod_reference: mod.mod_reference,
							version: mod.last_version?.version ?? '0.0.0'
						})
						.onConflictDoUpdate({
							target: [scModUpdates.guild_id, scModUpdates.mod_reference],
							set: {
								announced_at: now(),
								updated_at: now(),
								version: mod.last_version?.version ?? '0.0.0'
							}
						})
						.returning()
						.firstOrThrow('Failed to insert mod update');

					log(
						'tasks',
						`Check for guild ${guild_id}: ${mod.mod_reference} - ${exists?.version ?? 'NEW!'} -> ${mod.last_version?.version ?? '0.0.0'}`
					);
					if (!mod.last_version?.version || !announce) {
						return;
					}

					const guild = await DiscordGuildManager.getGuild(guild_id);
					if (guild.isValid()) {
						const updateChannel = await guild
							.chatChannel(configuration.update_text_channel_id)
							.catch(() => {
								return null;
							});
						const changelogThreadChannel = await guild
							.forumChannel(configuration.changelog_forum_id)
							.catch(() => {
								return null;
							});

						if (!updateChannel) {
							throw new Error(
								`Update channel ${configuration.update_text_channel_id} not found for guild ${guild_id}`
							);
						}

						let threadId: null | string = null;
						if (changelogThreadChannel) {
							const tag = changelogThreadChannel.availableTags.find((e) => {
								return e.name === mod.mod_reference;
							});
							const appliedTags = tag ? [tag.id] : [];

							await guild
								.sendForumThread({
									channelId: configuration.changelog_forum_id,
									thread: {
										name: `${mod.name} - v.${mod.last_version!.version}`,
										message: {
											content: mod.last_version!.changelog
										},
										appliedTags
									}
								})
								.then((thread) => {
									log('tasks', 'successfully sent thread');
									if (!thread) return;
									threadId = thread.id;
								});
						}

						if (updateChannel) {
							const embed = createEmbed({
								author: {
									name: mod.name,
									iconURL: mod.logo || LOGO
								},
								thumbnail: mod.logo || LOGO,
								title: `v.${mod.last_version!.version} - ${mod.name}`,
								fields: [
									{
										name:
											mod.last_version!.changelog !== ''
												? mod
														.last_version!.changelog.split(/\r?\n/)[0]
														.substring(0, 255)
												: '...',
										value: `Now available on SMM and SMR \n\n For any suggestion please use <#${configuration.changelog_suggestion_channel_id}> \n And for bug reports <#${configuration.changelog_bug_channel_id}>.`
									},
									{
										name: 'Changelog',
										value: threadId
											? `<#${threadId}>`
											: `[Click here](https://ficsit.app/mod/${mod.mod_reference}/version/${mod.last_version!.id})`,
										inline: true
									},
									{
										name: 'Mod Page',
										value: `[Click here](https://ficsit.app/mod/${mod.mod_reference})`,
										inline: true
									},
									{
										name: 'All our Mods',
										value: `[Click here](https://ficsit.app/user/${mod.creator_id})`,
										inline: true
									}
								]
							});

							const role =
								guild.getGuild.roles.cache.find((role) => {
									return role.id === configuration.default_ping_role;
								}) ?? guild.getGuild.roles.everyone;

							await updateChannel
								.send({
									embeds: embed ? [embed] : undefined,
									content: `${role} new mod update has been released!\n\n`
								})
								.then((message) => {
									log('tasks', 'successfully sent message', {
										content: message.content,
										mod: mod.mod_reference,
										version: mod.last_version?.version
									});
								});
						}
					}
				})
				.catch((e) => {
					log('tasks-error', e);
				});
		}
	}
	log('tasks', 'Check for mod updates Finished!');
}
