import { FC }                   from "react";
import {
	json,
	LoaderFunction,
	useLoaderData
}                               from "react-router-dom";
import { IMO_ChatCommands }     from "@shared/types/MongoDB";
import { fetchGetJson }         from "@kyri123/k-reactutils";
import { TR_CC_Question_GET }   from "@shared/types/API_Response";
import { TReq_CC_Question_GET } from "@shared/types/API_Request";
import { getGuildRequest }      from "@hooks/useAuth";
import ChatCommandEditor        from "@comp/chatCommands/ChatCommandEditor";
import { Accordion }            from "flowbite-react";
import ChatCommandElement       from "@comp/chatCommands/ChatCommandElement";

interface ILoaderData {
	chatReactions : IMO_ChatCommands[];
}

const loader : LoaderFunction = async( { request, params } ) => {
	const chatReactionsResult = await fetchGetJson<TReq_CC_Question_GET, TR_CC_Question_GET>( getGuildRequest<TReq_CC_Question_GET>( params ) );
	const chatReactions = chatReactionsResult?.Data || [];

	return json<ILoaderData>( {
		chatReactions
	} );
};

const Component : FC = () => {
	const { chatReactions } = useLoaderData() as ILoaderData;

	return ( <>
		<ChatCommandEditor/>
		{ chatReactions.length > 0 && <Accordion>
			{ chatReactions.map( ( reaction ) => ( <ChatCommandElement key={ reaction._id } data={ reaction }/> ) ) }
		</Accordion> }
	</> );
};


export {
	Component,
	loader
};