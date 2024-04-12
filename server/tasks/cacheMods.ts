import { eq } from '@kmods/drizzle-pg';
import { gql, GraphQLClient } from 'graphql-request';
import { schedule } from 'node-cron';
import { env } from '~/env';
import { log } from '~/utils/logger';
import { db, scModAuthors, scModCache, scModVersions } from '../utils/db/postgres/pg';

const client = new GraphQLClient(env.ficsit.url, { headers: {} });
function getQueryChunk(offset: number) {
	return gql`
        query {
            getMods( filter: { limit: 100, offset: ${offset}, hidden: true } ) {
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
}

async function exec() {
	try {
		let maxReached = false;
		let offset = 0;
		let total = 0;
		log('tasks', 'Start Update Mods!');
		while (!maxReached) {
			try {
				const { getMods } = (await client.request(getQueryChunk(offset))) as any;
				const { mods, count } = getMods;
				total = count;

				await Promise.all(
					mods.map((mod: any) => {
						return db
							.transaction(async (trx) => {
								const set: typeof scModCache.$inferInsert = {
									mod_id: mod.id,
									name: mod.name,
									logo: mod.logo,
									short_description: mod.short_description,
									source_url: mod.source_url,
									creator_id: mod.creator_id,
									views: mod.views,
									downloads: mod.downloads,
									updated_at: mod.updated_at,
									created_at: mod.created_at,
									last_version_date: mod.last_version_date,
									hidden: mod.hidden,
									last_versions: mod.latestVersions,
									mod_reference: mod.mod_reference
								};

								const { mod_id } = await trx
									.insert(scModCache)
									.values(set)
									.onConflictDoUpdate({
										set,
										target: [scModCache.mod_id]
									})
									.firstOrThrow(`failed to insert mod ${mod.id} / ${mod.name}`);

								await trx
									.delete(scModVersions)
									.where(eq(scModVersions.mod_id, mod_id));
								await trx
									.delete(scModAuthors)
									.where(eq(scModAuthors.mod_id, mod_id));

								for (const author of mod.authors) {
									await trx
										.insert(scModAuthors)
										.values({
											mod_id,
											user_id: author.user_id,
											role: author.role,
											name: author.user.username
										})
										.firstOrThrow(
											`failed to insert author ${author.user_id} / ${author.user.username}`
										);
								}

								for (const version of mod.versions) {
									await trx
										.insert(scModVersions)
										.values({
											mod_id,
											id: version.id,
											created_at: version.created_at,
											updated_at: version.updated_at,
											changelog: version.changelog,
											hash: version.hash,
											version: version.version,
											sml_version: version.sml_version
										})
										.firstOrThrow(
											`failed to insert version ${version.id} / ${version.version}`
										);
								}
							})
							.catch((e) => {
								log('ficsit-error', e.message);
							});
					})
				);

				offset += 100;
				maxReached = count < offset;
			} catch (e) {
				if (e instanceof Error) {
					log('ficsit-error', e.message);
				}
				maxReached = true;
			}
		}
		log('tasks', `Update Mods (${total}) Finished!`);
	} catch (e) {
		if (e instanceof Error) {
			log('tasks-error', e.message);
		}
	}
}

export function installModTask(cron: string, runOnInit?: boolean) {
	if (env.dev) {
		log('tasks', 'Not installing task "cache mods" in dev mode');
		return;
	}
	schedule(cron, exec, {
		runOnInit
	});
	log('tasks', `Scheduled task to cache mods every "${cron}"`);
}
