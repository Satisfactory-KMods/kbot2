import {
	FC,
	FormEvent,
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
	fetchPutJson
}                                   from "@kyri123/k-reactutils";
import { EApiAuth }                 from "@shared/Enum/EApiPath";
import { TextInput }                from "flowbite-react";
import { SlLogin }                  from "react-icons/all";
import LoadButton                   from "@comp/LoadButton";
import { TReq_Auth_Account_Put }    from "@shared/types/API_Request";
import { TR_Auth_Account_Checkout } from "@shared/types/API_Response";
import { ILoaderDataBase }          from "@app/types/routing";
import { fireToastFromApi }         from "@lib/sweetAlert";

interface ILoaderData extends ILoaderDataBase {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { authCode } = params;
	const result = await validateLogin();
	if ( result.loggedIn ) {
		window.location.replace( "/" );
	}

	const Response = await fetchCheckoutJson<{ authCode? : string }, { tokenOk : boolean }>( {
		path: EApiAuth.validate,
		data: { authCode }
	} ).catch( console.warn );

	const tokenValid = !( !Response || !Response.tokenOk );
	if ( !tokenValid ) {
		window.location.replace( "/error/401" );
	}

	return json<ILoaderData>( { tokenValid, ...result } );
};

const Component : FC = () => {
	const navigate = useNavigate();
	const { authCode } = useParams();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ inputError, setInputError ] = useState( [ false, false, false ] );
	const { tokenValid } = useLoaderData() as ILoaderData;

	const loginRef = useRef<HTMLInputElement>( null );
	const passwordRef = useRef<HTMLInputElement>( null );
	const passwordAgainRef = useRef<HTMLInputElement>( null );

	const onSubmit = async( event : FormEvent<HTMLFormElement> ) => {
		event.preventDefault();

		const username = loginRef.current?.value;
		const password = passwordRef.current?.value;
		const passwordAgain = passwordAgainRef.current?.value;

		if ( username !== undefined && password !== undefined && passwordAgain !== undefined ) {
			setInputError( [ username.length < 6, password.length < 8, password !== passwordAgain ] );
			if ( username.length < 6 || password.length < 8 || password !== passwordAgain ) {
				return;
			}
			setIsLoading( true );
			const Response = await fetchPutJson<TReq_Auth_Account_Put, TR_Auth_Account_Checkout>( {
				path: EApiAuth.account,
				data: { username, password, passwordAgain, token: authCode! }
			} ).catch( console.warn );

			if ( Response ) {
				if ( Response.Success ) {
					window.localStorage.setItem( "session", Response.Data.token );
					navigate( "/" );
				}
				else {
					fireToastFromApi( Response );
				}
			}
		}

		setIsLoading( false );
	};

	if ( !tokenValid ) {
		return ( <></> );
	}

	return (
		<>
			<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-white text-center">
				Create a new account
			</h1>
			<form className="space-y-4" action="#" onSubmit={ onSubmit }>
				<TextInput color={ inputError[ 0 ] ? "failure" : "gray" } className="w-full mt-6"
						   placeholder="Login name" ref={ loginRef }
						   helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Username is too
							   short... must be 6 character long.</> : undefined }/>
				<TextInput color={ inputError[ 1 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
						   type="password"
						   ref={ passwordRef }
						   helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Password is too
							   short... must be 8 character long.</> : undefined }/>
				<TextInput color={ inputError[ 2 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
						   type="password"
						   ref={ passwordAgainRef }
						   helperText={ inputError[ 2 ] ? <><span className="font-medium">Oops!</span> Password must
							   match</> : undefined }/>

				<LoadButton className="w-full" isLoading={ isLoading } type={ "submit" }
							icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Sign up
				</LoadButton>
			</form>
		</>
	);
};

export {
	Component,
	loader
};
