import {
	FC,
	useRef,
	useState
}                                   from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate,
	useParams
}                                   from "react-router-dom";
import { validateLogin }            from "@hooks/useAuth";
import {
	fetchCheckoutJson,
	fetchPostJson
}                                   from "@kyri123/k-reactutils";
import { EApiAuth }                 from "@shared/Enum/EApiPath";
import {
	Button,
	TextInput
}                                   from "flowbite-react";
import {
	SiDiscord,
	SiGithub,
	SiPatreon,
	SlLogin
}                                   from "react-icons/all";
import LoadButton                   from "@comp/LoadButton";
import { TReq_Auth_Account_Post }   from "@shared/types/API_Request";
import { TR_Auth_Account_Checkout } from "@shared/types/API_Response";
import { ILoaderDataBase }          from "@app/types/routing";

interface ILoaderData extends ILoaderDataBase {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { authcode } = params;
	const result = await validateLogin();
	if ( result.loggedIn ) {
		window.location.replace( "/" );
	}

	const Response = await fetchCheckoutJson<{ authcode? : string }, { tokenOk : boolean }>( {
		path: EApiAuth.validate,
		data: { authcode }
	} ).catch( console.warn );

	const tokenValid = !( !Response || !Response.tokenOk );
	if ( !tokenValid ) {
		window.location.replace( "/error/401" );
	}

	return json<ILoaderData>( { tokenValid, ...result } );
};

const Component : FC = () => {
	const navigate = useNavigate();
	const { authcode } = useParams();
	const [ isLoading, setIsLoading ] = useState( false );
	const { tokenValid } = useLoaderData() as ILoaderData;

	const loginRef = useRef<HTMLInputElement>( null );
	const passwordRef = useRef<HTMLInputElement>( null );
	const passwordAgainRef = useRef<HTMLInputElement>( null );

	if ( !tokenValid ) {
		return ( <></> );
	}

	const OnSubmit = async() => {
		setIsLoading( true );

		if ( loginRef.current && passwordRef.current && passwordAgainRef.current ) {
			const Response = await fetchPostJson<TReq_Auth_Account_Post, TR_Auth_Account_Checkout>( {
				path: EApiAuth.account,
				data: {
					username: loginRef.current.value,
					password: passwordRef.current.value,
					passwordAgain: passwordRef.current.value,
					token: authcode!
				}
			} ).catch( console.warn );

			if ( Response ) {
				window.localStorage.setItem( "session", Response.Data.token );
				navigate( "/" );
			}
		}

		setIsLoading( false );
	};

	return (
		<>
			<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-white text-center">
				Create a new account
			</h1>
			<form className="space-y-4 md:space-y-6" action="#">
				<TextInput className="w-full" placeholder="Login name" ref={ loginRef }/>
				<TextInput className="w-full" placeholder="Password" ref={ passwordRef }/>
				<TextInput className="w-full" placeholder="Repeat password" ref={ passwordAgainRef }/>

				<LoadButton className="w-full" isLoading={ isLoading }
							icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Sign up
				</LoadButton>
				<div className="flex flex-wrap gap-2">
					<Button href={ "https://github.com/Kyri123/kbot2" } target="_blank" color="gray" className="flex-1">
						<SiGithub className="mr-3 h-4 w-4"/>
						Source
					</Button>
					<Button href={ "https://www.patreon.com/kmods" } target="_blank" color="gray" className="flex-1">
						<SiPatreon className="mr-3 h-4 w-4"/>
						Donate
					</Button>
					<Button href={ "https://discord.gg/BeH4GRRWxc" } target="_blank" color="gray" className="flex-1">
						<SiDiscord className="mr-3 h-4 w-4"/>
						Discord
					</Button>
				</div>
			</form>
		</>
	);
};

export {
	Component,
	loader
};
