import {
	FC,
	useMemo,
	useState
}                        from "react";
import { useLoaderData } from "react-router-dom";
import { usePageTitle }  from "@kyri123/k-reactutils";
import GuildSelectRow    from "@comp/pageComponents/GuildSelectRow";
import { Pagination }    from "flowbite-react";

const Component : FC = () => {
	usePageTitle( `Kbot 2.0 - Select a Server` );
	const { loggedIn, guilds } = useLoaderData() as LoaderData;
	const [ page, setPage ] = useState( 1 );

	const TotalPage = useMemo( () => {
		return Math.ceil( guilds.length / 5 );
	}, [ guilds ] );

	const ShowElements = useMemo( () => {
		return [ ...guilds ].splice( ( page - 1 ) * 5, 5 );
	}, [ guilds, page ] );


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
	Component,
	loader
};