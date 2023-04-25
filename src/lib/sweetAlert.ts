import Swal, { SweetAlertOptions } from "sweetalert2";
import { IAPIResponseBase }        from "@shared/types/API_Response";
import swalTextError               from "@lib/data/swalTextError.json";
import swalTextSuccess             from "@lib/data/swalTextSuccess.json";

export function fireSwalFromApi<PreConfirmResult = any>( response : Partial<IAPIResponseBase>, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( response.MessageCode ) {
		// @ts-ignore
		const text = !response.Success ? swalTextError[ response.MessageCode || response ] : swalTextSuccess[ response.MessageCode || response ];

		if ( text ) {
			return Swal.fire<PreConfirmResult>( {
				text,
				icon: response.Success ? "success" : "error",
				showConfirmButton: false,
				timerProgressBar: true,
				timer: 3000,
				...moreOptions
			} );
		}
		else {
			console.warn( "cannot find message for msg code:", response.MessageCode );
		}
	}
	return null;
}

export function fireToastFromApi<PreConfirmResult = any>( response : Partial<IAPIResponseBase>, moreOptions? : SweetAlertOptions<PreConfirmResult> ) {
	if ( response.MessageCode ) {
		// @ts-ignore
		const text = !response.Success ? swalTextError[ response.MessageCode || response ] : swalTextSuccess[ response.MessageCode || response ];

		if ( text ) {
			return Swal.fire( {
				position: "bottom-end",
				toast: true,
				text,
				icon: response.Success ? "success" : "error",
				showConfirmButton: false,
				timerProgressBar: true,
				timer: 3000,
				...moreOptions
			} );
		}
		else {
			console.warn( "cannot find message for msg code:", response.MessageCode );
		}
	}
	return null;
}