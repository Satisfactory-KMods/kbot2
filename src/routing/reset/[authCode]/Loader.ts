import { LoaderDataBase } from '@app/types/routing';
import { validateLogin } from '@hooks/useAuth';
import { tRPC_handleError, tRPC_Public } from '@lib/tRPC';
import { EApiTokenType } from '@shared/Enum/EApiMethods';
import { json, LoaderFunction, redirect } from 'react-router-dom';

export interface ResetLoaderData extends LoaderDataBase {
	tokenValid: boolean;
}

export const loader: LoaderFunction = async ({ params }) => {
	const { authCode } = params;
	const result = await validateLogin();

	const Response = await tRPC_Public.checktoken
		.mutate({
			token: authCode!,
			type: EApiTokenType.reset
		})
		.catch(tRPC_handleError);

	const tokenValid = !!Response?.valid;
	if (!tokenValid) {
		return redirect('/error/401');
	}

	return json<ResetLoaderData>({ tokenValid, ...result });
};
