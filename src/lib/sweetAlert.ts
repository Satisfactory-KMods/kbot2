import Swal, { SweetAlertOptions } from "sweetalert2";
import { isArray }                 from "lodash";

export function fireSwalFromApi<PreConfirmResult = any>( message : string[] | string | undefined, success? : boolean, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( message && message.length >= 0 ) {
		return Swal.fire<PreConfirmResult>( {
			html: isArray( message ) ? message.join( "<br />" ) : message,
			icon: success ? "success" : "error",
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}

export function fireToastFromApi<PreConfirmResult = any>( message : string[] | string | undefined, success? : boolean, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( message && message.length >= 0 ) {
		return Swal.fire( {
			position: "bottom-end",
			toast: true,
			html: isArray( message ) ? message.join( "<br />" ) : message,
			icon: success ? "success" : "error",
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 3000,
			...moreOptions
		} );
	}
	return null;
}