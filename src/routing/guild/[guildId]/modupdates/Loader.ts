import { tRPC_Guild } from '@lib/tRPC';
import { MO_ModUpdate } from '@shared/types/MongoDB';
import { json, LoaderFunction } from 'react-router-dom';

export interface GuildModUpdateLoaderData {
	watchedMods: MO_ModUpdate[];
}

const loader: LoaderFunction = async ({ params }) => {
	const { guildId } = params;

	const watchedModsResult = await tRPC_Guild.modupdates.watchedmods.query({
		guildId: guildId!
	});
	const watchedMods: any[] = watchedModsResult?.mods || [];

	return json<GuildModUpdateLoaderData>({ watchedMods });
};

export { loader };
