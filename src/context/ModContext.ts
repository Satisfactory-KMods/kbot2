import { MO_Mod } from '@shared/types/MongoDB';
import { createContext } from 'react';

const ModContext = createContext<MO_Mod[]>([]);

export { ModContext };
