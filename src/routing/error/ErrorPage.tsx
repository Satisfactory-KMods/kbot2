import { FC }           from "react";
import {
	Link,
	useLocation,
	useParams
}                       from "react-router-dom";
import { usePageTitle } from "@kyri123/k-reactutils";


const ErrorPage : FC = () => {
	const { ErrorCode } = useParams();
	const { pathname } = useLocation();
	usePageTitle( `SBS - Error ${ ErrorCode }` );

	return (
		<div className={ "d-flex h-100 justify-content-center" }>
			<div className={ "align-self-center d-flex bg-gray-800 p-5 border rounded-4" }>
				<div className={ "d-inline text-6xl pe-4 text-danger align-middle" }>{ ErrorCode }</div>
				<div className={ "d-inline text-lg" }>
					<span className={ "d-block text-xl" }></span>
					<span className={ "d-block" }></span>
					<span className={ "d-block" }>
						<Link to={ pathname.replace( `error/${ ErrorCode }`, "" ) }
							  className={ "btn btn-secondary mt-3" }>Home</Link>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ErrorPage;
