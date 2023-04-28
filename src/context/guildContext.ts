import { createContext } from "react";
import { MO_Guild }      from "@shared/types/MongoDB";

const guildContext = createContext<MO_Guild>( {} as MO_Guild );

export default guildContext;