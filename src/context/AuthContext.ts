import { TUseAuth } from '@hooks/useAuth';
import { createContext } from 'react';

const AuthContext = createContext<TUseAuth>([null, null, null] as unknown as TUseAuth);

export default AuthContext;
