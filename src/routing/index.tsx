import {
	FC,
	useMemo,
	useState
}                                from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                                from "react-router-dom";
import {
	getToken,
	validateLogin
}                                from "@hooks/useAuth";
import { ILoaderDataBase }       from "@app/types/routing";
import { IMO_Guild }             from "@shared/types/MongoDB";
import { fetchGetJson }          from "@kyri123/k-reactutils";
import { EApiGuild }             from "@shared/Enum/EApiPath";
import { APIRequest }            from "discord.js";
import { TR_Guild_Question_Get } from "@shared/types/API_Response";
import GuildSelectRow            from "@comp/pageComponents/GuildSelectRow";
import { Pagination }            from "flowbite-react";

interface ILoaderData extends ILoaderDataBase {
	guilds : IMO_Guild[];
}

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( !result.loggedIn ) {
		window.location.replace( "/login" );
	}

	const guilds = await fetchGetJson<APIRequest, TR_Guild_Question_Get>( {
		path: EApiGuild.question,
		auth: getToken()
	} );

	return json<ILoaderData>( {
		...result,
		guilds: ( guilds?.Data || [] )
	} );
};

const Component : FC = () => {
	const { loggedIn, guilds } = useLoaderData() as ILoaderData;
	const [ page, setPage ] = useState( 1 );

	const TotalPage = useMemo( () => {
		return Math.ceil( guilds.length / 5 );
	}, [ guilds ] );

	const ShowElements = useMemo( () => {
		return [ ...guilds ].splice( ( page - 1 ) * 5, 5 );
	}, [ guilds ] );


	if ( !loggedIn ) {
		return ( <></> );
	}
	console.log( guilds );
	return ( <>
		<div className="mb-4 flex items-center justify-between">
			<h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
				Select a Server
			</h5>
		</div>
		<div className="flow-root">
			<ul className="divide-y divide-gray-200 dark:divide-gray-700">
				{ guilds.map( ( guild ) => ( <GuildSelectRow guild={ guild } key={ guild._id }/> ) ) }
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