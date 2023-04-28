import { createContext } from "react";
import { TUseAuth }      from "@hooks/useAuth";

const AuthContext = createContext<TUseAuth>( [ null, null, null ] as unknown as TUseAuth );

export default AuthContext;