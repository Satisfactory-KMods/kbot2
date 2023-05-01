import { FC }              from "react";
import { useLoaderData }   from "react-router-dom";
import { usePageTitle }    from "@kyri123/k-reactutils";
import GuildSelectRow      from "@comp/pageComponents/GuildSelectRow";
import { Pagination }      from "flowbite-react";
import { IndexLoaderData } from "@routing/Loader";
import usePages            from "@hooks/usePages";

const Component : FC = () => {
	usePageTitle( `Kbot 2.0 - Select a Server` );
	const { loggedIn, guilds } = useLoaderData() as IndexLoaderData;

	const [ ShowElements, TotalPage, page, setPage ] = usePages( guilds );

	if ( !loggedIn ) {
		return ( <></> );
	}

	return ( <>
		<div className="mb-4 flex items-center justify-between text-center">
			<h5 className="text-3xl font-bold leading-none text-gray-900 dark:text-white text-center">
				Select a Server
			</h5>
		</div>
		<div className="flow-root -mx-8 border-y border-gray-700">
			<ul className="divide-y divide-gray-200 dark:divide-gray-700">
				{ ShowElements.map( ( guild ) => ( <GuildSelectRow guild={ guild } key={ guild._id }/> ) ) }
			</ul>
		</div>
		{ TotalPage > 1 && <div className="flex items-center justify-center text-center">
			<Pagination
				layout="navigation"
				currentPage={ page }
				totalPages={ TotalPage }
				onPageChange={ setPage }
			/>
		</div> }
	</> );
};


export {
	Component
};