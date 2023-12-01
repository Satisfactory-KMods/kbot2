import { LoaderDataBase } from '@app/types/routing';
import { validateLogin } from '@hooks/useAuth';
import { json, LoaderFunction, redirect } from 'react-router-dom';

const loader: LoaderFunction = async () => {
	const result = await validateLogin();
	if (result.loggedIn) {
		return redirect('/');
	}
	return json<LoaderDataBase>(result);
};

export { loader };
