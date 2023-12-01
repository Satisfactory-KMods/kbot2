import { tRPC_Guild, tRPC_handleError } from '@lib/tRPC';
import { MO_ChatCommands } from '@shared/types/MongoDB';
import { json, LoaderFunction } from 'react-router-dom';

export interface GuildCommandsLoaderData {
	chatReactions: MO_ChatCommands[];
}

const loader: LoaderFunction = async ({ params }) => {
	const { guildId } = params;
	const chatReactionsResult = await tRPC_Guild.chatcommands.getcommands.query({ guildId: guildId! }).catch(tRPC_handleError);
	const chatReactions: MO_ChatCommands[] = chatReactionsResult?.commands || [];

	return json<GuildCommandsLoaderData>({
		chatReactions
	});
};

export { loader };
