import {
	FC,
	FormEvent,
	useContext,
	useRef,
	useState
}                                 from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate,
	useParams
}                                 from "react-router-dom";
import { validateLogin }          from "@hooks/useAuth";
import {
	fetchCheckoutJson,
	fetchPatchJson
}                                 from "@kyri123/k-reactutils";
import { EApiAuth }               from "@shared/Enum/EApiPath";
import { TextInput }              from "flowbite-react";
import { SlLogin }                from "react-icons/all";
import LoadButton                 from "@comp/LoadButton";
import { TReq_Auth_Modify_Patch } from "@shared/types/API_Request";
import { TR_Auth_Modify_Patch }   from "@shared/types/API_Response";
import { ILoaderDataBase }        from "@app/types/routing";
import {
	fireSwalFromApi,
	fireToastFromApi
}                                 from "@lib/sweetAlert";
import authContext                from "@context/authContext";

interface ILoaderData extends ILoaderDataBase {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { authCode } = params;
	const result = await validateLogin();

	const Response = await fetchCheckoutJson<{ authCode? : string, isReset? : boolean }, { tokenOk : boolean }>( {
		path: EApiAuth.validate,
		data: { authCode, isReset: true }
	} ).catch( console.warn );

	const tokenValid = !( !Response || !Response.tokenOk );
	if ( !tokenValid ) {
		window.location.replace( "/error/401" );
	}

	return json<ILoaderData>( { tokenValid, ...result } );
};

const Component : FC = () => {
	const [ , , setToken ] = useContext( authContext );
	const navigate = useNavigate();
	const { authCode } = useParams();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ inputError, setInputError ] = useState( [ false, false ] );
	const { tokenValid } = useLoaderData() as ILoaderData;

	const loginRef = useRef<HTMLInputElement>( null );
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
			const Response = await fetchPatchJson<TReq_Auth_Modify_Patch, TR_Auth_Modify_Patch>( {
				path: EApiAuth.account,
				data: { password, passwordAgain, token: authCode! }
			} ).catch( console.warn );

			if ( Response ) {
				if ( Response.Success ) {
					fireSwalFromApi( Response );
					setToken( Response.Data.token );
					navigate( "/" );
				}
				else {
					fireToastFromApi( Response );
				}
			}
			else {
				fireSwalFromApi( { MessageCode: "api.notfound" } );
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
				<TextInput color={ inputError[ 0 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
						   type="password"
						   ref={ passwordRef }
						   helperText={ inputError[ 0 ] ? <><span className="font-medium">Oops!</span> Password is too
							   short... must be 8 character long.</> : undefined }/>
				<TextInput color={ inputError[ 1 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
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
	Component,
	loader
};
