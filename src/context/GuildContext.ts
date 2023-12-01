import { MO_Guild } from '@shared/types/MongoDB';
import { createContext } from 'react';

const GuildContext = createContext({
	guildData: {} as MO_Guild,
	triggerGuildUpdate: async () => {}
});

export default GuildContext;
