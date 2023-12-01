import { ERoles } from '@shared/Enum/ERoles';
import { MO_UserAccount } from '@shared/types/MongoDB';

export const DefaultUser: MO_UserAccount = {
	discordId: '',
	_id: '',
	username: 'Default User',
	role: ERoles.member
};
