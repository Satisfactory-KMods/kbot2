import {
	FC,
	useRef,
	useState
}                                     from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate
}                                     from "react-router-dom";
import { validateLogin }              from "@hooks/useAuth";
import { ILoaderDataBase }            from "@app/types/routing";
import { fetchCheckoutJson }          from "@kyri123/k-reactutils";
import { TReq_Auth_Account_Checkout } from "@shared/types/API_Request";
import { TR_Auth_Account_Checkout }   from "@shared/types/API_Response";
import { EApiAuth }                   from "@shared/Enum/EApiPath";
import {
	Button,
	TextInput
}                                     from "flowbite-react";
import LoadButton                     from "@comp/LoadButton";
import {
	SiDiscord,
	SiGithub,
	SiPatreon,
	SlLogin
}                                     from "react-icons/all";

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( result.loggedIn ) {
		window.location.replace( "/" );
	}
	return json<ILoaderDataBase>( result );
};

const Component : FC = () => {
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( false );
	const { loggedIn } = useLoaderData() as ILoaderDataBase;

	const loginRef = useRef<HTMLInputElement>( null );
	const passwordRef = useRef<HTMLInputElement>( null );

	if ( loggedIn ) {
		return ( <></> );
	}

	const OnSubmit = async() => {
		setIsLoading( true );

		if ( loginRef.current && passwordRef.current ) {
			const Response = await fetchCheckoutJson<TReq_Auth_Account_Checkout, TR_Auth_Account_Checkout>( {
				path: EApiAuth.account,
				data: {
					username: loginRef.current.value,
					password: passwordRef.current.value
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
				Sign in to your account
			</h1>
			<form className="space-y-4 md:space-y-6" action="#">
				<TextInput className="w-full" placeholder="Discord id or login name" ref={ loginRef }/>
				<TextInput className="w-full" placeholder="Password" ref={ passwordRef }/>

				<LoadButton className="w-full" isLoading={ isLoading }
							icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Sign In
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
