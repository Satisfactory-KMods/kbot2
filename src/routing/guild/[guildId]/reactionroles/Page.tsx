import {
	FC,
	useId
}                                   from "react";
import {
	useLoaderData,
	useParams
}                                   from "react-router-dom";
import { GuildReactionRolesLoader } from "@guild/reactionroles/Loader";

const Component : FC = () => {
	const { guildId } = useParams();
	const Id = useId();
	const { messages, commands, channels } = useLoaderData() as GuildReactionRolesLoader;

	return (
		<>

		</>
	);
};

export {
	Component
};