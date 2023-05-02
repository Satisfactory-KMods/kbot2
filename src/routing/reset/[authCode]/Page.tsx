import {
	FC,
	FormEvent,
	useContext,
	useRef,
	useState
}                          from "react";
import {
	useLoaderData,
	useNavigate,
	useParams
}                          from "react-router-dom";
import { usePageTitle }    from "@kyri123/k-reactutils";
import { TextInput }       from "flowbite-react";
import { SlLogin }         from "react-icons/all";
import LoadButton          from "@comp/LoadButton";
import { fireSwalFromApi } from "@lib/sweetAlert";
import AuthContext         from "@context/AuthContext";
import {
	tRPC_handleError,
	tRPC_Public
}                          from "@lib/tRPC";
import { ResetLoaderData } from "@routing/reset/[authCode]/Loader";

const Component : FC = () => {
	usePageTitle( `Kbot 2.0 - Reset Password` );
	const [ , , setToken ] = useContext( AuthContext );
	const navigate = useNavigate();
	const { authCode } = useParams();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ inputError, setInputError ] = useState( [ false, false ] );
	const { tokenValid } = useLoaderData() as ResetLoaderData;

	const passwordRef = useRef<HTMLInputElement>( null );
	const passwordAgainRef = useRef<HTMLInputElement>( null );

	const onSubmit = async( event : FormEvent<HTMLFormElement> ) => {
		event.preventDefault();

		const password = passwordRef.current?.value;
		const passwordAgain = passwordAgainRef.current?.value;

		if ( password !== undefined && passwordAgain !== undefined ) {
			setInputError( [ password.length < 8, password !== passwordAgain ] );
			if ( password.length < 8 || password !== passwordAgain ) {
				return;
			}
			setIsLoading( true );
			const Response = await tRPC_Public.resetpassword.mutate( {
				password,
				token: authCode!
			} ).catch( tRPC_handleError );

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
				Reset your password
			</h1>
			<form className="space-y-4" action="#" onSubmit={ onSubmit }>
				<TextInput color={ inputError[ 0 ] ? "failure" : "gray" } className="w-full mt-6"
				           placeholder="Password"
				           type="password"
				           ref={ passwordRef }
				           helperText={ inputError[ 0 ] ? <><span className="font-medium">Oops!</span> Password is too
					           short... must be 8 character long.</> : undefined }/>
				<TextInput color={ inputError[ 1 ] ? "failure" : "gray" } className="w-full mt-6"
				           placeholder="Password"
				           type="password"
				           ref={ passwordAgainRef }
				           helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Password must
					           match</> : undefined }/>

				<LoadButton className="w-full" isLoading={ isLoading } type={ "submit" }
				            icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Reset password and login
				</LoadButton>
			</form>
		</>
	);
};

export {
	Component
};
