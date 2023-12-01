import { MO_Guild } from '@shared/types/MongoDB';

export interface LoaderDataBase {
	loggedIn: boolean;
}

export interface LoaderGuild extends LoaderDataBase {
	guildData: MO_Guild | undefined;
}
