import {
	FC,
	useId
}                                   from "react";
import {
	useLoaderData,
	useParams
}                                   from "react-router-dom";
import { GuildReactionRolesLoader } from "@guild/reactionroles/Loader";
import { Pagination }               from "flowbite-react";
import usePages                     from "@hooks/usePages";

const Component : FC = () => {
	const { guildId } = useParams();
	const Id = useId();
	const { messages, reactionRoles, channels } = useLoaderData() as GuildReactionRolesLoader;

	const [ ShowElements, TotalPage, page, setPage, setCommands, reactions ] = usePages( () => reactionRoles, 10 );

	return (
		<>

			{ TotalPage > 1 &&
				<Pagination currentPage={ page } totalPages={ TotalPage } onPageChange={ setPage }
				            className="mb-5 text-center"/> }
		</>
	);
};

export {
	Component
};