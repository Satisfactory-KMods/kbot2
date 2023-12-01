import { tRPC_Guild, tRPC_handleError } from '@lib/tRPC';
import { DiscordMessage } from '@shared/types/discord';
import { MO_ReactionRoles } from '@shared/types/MongoDB';
import { json, LoaderFunction, redirect } from 'react-router-dom';

export interface GuildReactionRolesLoader {
	reactionRoles: MO_ReactionRoles[];
	messages: Record<string, DiscordMessage>;
}

const queryReactionRoles = async (guildId: string): Promise<GuildReactionRolesLoader | undefined> => {
	const result = await tRPC_Guild.reactionroles.getReactionRoles.query({ guildId }).catch(tRPC_handleError);

	if (result) {
		return {
			reactionRoles: result.reactionRoles as any,
			messages: result.messages as any
		};
	}

	return undefined;
};

const loader: LoaderFunction = async ({ params }) => {
	const { guildId } = params;

	const result = await queryReactionRoles(guildId!);
	if (!result) {
		return redirect('/error/404');
	}

	return json<GuildReactionRolesLoader>(result);
};

export { loader, queryReactionRoles };
