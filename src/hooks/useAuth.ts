import { LoaderDataBase, LoaderGuild } from '@app/types/routing';
import { useLocalStorage } from '@kyri123/k-reactutils';
import { tRPC_Guild, tRPC_Public } from '@lib/tRPC';
import { User } from '@shared/class/User.Class';
import { useMemo } from 'react';

// @return false if the user is not logged in
const validateLogin = async (): Promise<LoaderDataBase> => {
	const token = window.localStorage.getItem('session') || '';
	const Response = await tRPC_Public.validate.query({ token }).catch(console.warn);

	const loggedIn = !!Response?.tokenValid;
	if (!loggedIn) {
		window.localStorage.setItem('session', '');
	}

	return { loggedIn };
};

const validateLoginWithGuild = async (guildId: string): Promise<LoaderGuild> => {
	const Response = await tRPC_Guild.validate.query({ guildId }).catch(console.warn);

	if (!Response) {
		return { loggedIn: false, guildData: undefined };
	}

	return { loggedIn: Response?.tokenValid, guildData: undefined, ...Response };
};

export type TUseAuth = [User, () => void, (newToken: string) => void];

const useAuth = (): TUseAuth => {
	const { Storage, ResetStorage, SetStorage } = useLocalStorage('session', '');

	const Data = useMemo(() => new User(Storage), [Storage]);

	const Logout = () => {
		ResetStorage();
		window.location.href = '/login';
	};

	return [Data, Logout, SetStorage];
};

export default useAuth;
export { validateLogin, validateLoginWithGuild };
