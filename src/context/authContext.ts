import { createContext } from "react";
import { TUseAuth }      from "@hooks/useAuth";

const authContext = createContext<TUseAuth>( [ null, null, null ] as unknown as TUseAuth );

export default authContext;