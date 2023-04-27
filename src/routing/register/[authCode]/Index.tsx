import {
	FC,
	FormEvent,
	useContext,
	useRef,
	useState
}                          from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate,
	useParams
}                          from "react-router-dom";
import { validateLogin }   from "@hooks/useAuth";
import { usePageTitle }    from "@kyri123/k-reactutils";
import { TextInput }       from "flowbite-react";
import { SlLogin }         from "react-icons/all";
import LoadButton          from "@comp/LoadButton";
import { ILoaderDataBase } from "@app/types/routing";
import { fireSwalFromApi } from "@lib/sweetAlert";
import authContext         from "@context/authContext";
import {
	tRCP_handleError,
	tRPC_Public
}                          from "@lib/tRPC";
import { EApiTokenType }   from "@shared/Enum/EApiMethods";

interface ILoaderData extends ILoaderDataBase {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { authCode } = params;
	const result = await validateLogin();

	const Response = await tRPC_Public.checktoken.mutate( {
		token: authCode!,
		type: EApiTokenType.reg
	} ).catch( tRCP_handleError );

	const tokenValid = !!Response?.valid;
	if ( !tokenValid ) {
		window.location.replace( "/error/401" );
	}

	return json<ILoaderData>( { tokenValid, ...result } );
};

const Component : FC = () => {
	usePageTitle( `Kbot 2.0 - Register` );
	const [ , , setToken ] = useContext( authContext );
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
			const Response = await tRPC_Public.register.mutate( {
				username,
				password,
				token: authCode!
			} ).catch( tRCP_handleError );

			if ( Response ) {
				fireSwalFromApi( Response.message, true );
				setToken( Response.token );
				navigate( "/" );
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
				           helperText={ inputError[ 0 ] ? <><span className="font-medium">Oops!</span> Username is too
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
