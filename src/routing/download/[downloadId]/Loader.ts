import {
	json,
	LoaderFunction,
	redirect
} from "react-router-dom";
import {
	tRPC_handleError,
	tRPC_Public
} from "@lib/tRPC";

export interface DownloadLoaderData {
	tokenValid : boolean;
}

const loader : LoaderFunction = async( { params } ) => {
	const { downloadId } = params;

	const Response = await tRPC_Public.patreon.checkDownload.query( {
		downloadId: downloadId!
	} ).catch( tRPC_handleError );

	const tokenValid = !!Response?.valid;
	if ( !tokenValid ) {
		return redirect( "/error/404" );
	}

	return json<DownloadLoaderData>( { tokenValid } );
};

export {
	loader
};
