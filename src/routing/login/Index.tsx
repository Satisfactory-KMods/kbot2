import {
	FC,
	FormEvent,
	useContext,
	useRef,
	useState
}                         from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate
}                         from "react-router-dom";
import { validateLogin }  from "@hooks/useAuth";
import { LoaderDataBase } from "@app/types/routing";
import { usePageTitle }   from "@kyri123/k-reactutils";
import {
	Checkbox,
	Label,
	TextInput
}                         from "flowbite-react";
import LoadButton         from "@comp/LoadButton";
import { SlLogin }        from "react-icons/all";
import AuthContext        from "@context/AuthContext";
import {
	tRCP_handleError,
	tRPC_Public
}                         from "@lib/tRPC";

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( result.loggedIn ) {
		window.location.replace( "/" );
	}
	return json<LoaderDataBase>( result );
};

const Component : FC = () => {
	usePageTitle( `Kbot 2.0 - Login` );
	const [ , , setToken ] = useContext( AuthContext );
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ inputError, setInputError ] = useState( [ false, false ] );
	const { loggedIn } = useLoaderData() as LoaderDataBase;

	const loginRef = useRef<HTMLInputElement>( null );
	const passwordRef = useRef<HTMLInputElement>( null );
	const stayLoggedInRef = useRef<HTMLInputElement>( null );

	if ( loggedIn ) {
		return ( <></> );
	}

	const OnSubmit = async( event : FormEvent<HTMLFormElement> ) => {
		event.preventDefault();

		const login : string | undefined = loginRef.current?.value;
		const password : string | undefined = passwordRef.current?.value;
		const stayLoggedIn : boolean | undefined = !!stayLoggedInRef.current?.checked;

		if ( login !== undefined && password !== undefined ) {
			setInputError( [ login.length < 6, password.length < 8 ] );
			if ( login.length < 6 || password.length < 8 ) {
				return;
			}

			setIsLoading( true );
			const Response = await tRPC_Public.login.mutate( {
				login,
				password,
				stayLoggedIn
			} ).catch( tRCP_handleError );

			if ( Response ) {
				setToken( Response.token );
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
			<form className="space-y-4" action="#" onSubmit={ OnSubmit }>
				<TextInput color={ inputError[ 0 ] ? "failure" : "gray" } className="w-full mt-6"
				           placeholder="Discord id or login name" ref={ loginRef }
				           helperText={ inputError[ 0 ] ? <><span className="font-medium">Oops!</span> Username is too
					           short... must be 6 character long.</> : undefined }/>
				<TextInput color={ inputError[ 1 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
				           type="password"
				           ref={ passwordRef }
				           helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Password is too
					           short... must be 8 character long.</> : undefined }/>

				<div className="flex items-center gap-2 mt-6">
					<Checkbox id="remember" defaultChecked={ true } ref={ stayLoggedInRef }/>
					<Label htmlFor="remember">
						Remember me
					</Label>
				</div>

				<LoadButton className="w-full" isLoading={ isLoading } type={ "submit" }
				            icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Sign In
				</LoadButton>
			</form>
		</>
	);
};

export {
	Component,
	loader
};
