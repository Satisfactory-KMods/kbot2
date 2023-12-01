import { DiscordRole } from '@shared/types/discord';
import { createContext } from 'react';

const RoleContext = createContext<DiscordRole[]>([]);

export { RoleContext };
