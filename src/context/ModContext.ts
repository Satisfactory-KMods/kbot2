import { createContext } from "react";
import { MO_Mod }        from "@shared/types/MongoDB";

const ModContext = createContext<MO_Mod[]>( [] );

export {
	ModContext
};