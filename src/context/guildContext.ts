import { createContext } from "react";
import { IMO_Guild }     from "@shared/types/MongoDB";

const guildContext = createContext<IMO_Guild>( {} as IMO_Guild );

export default guildContext;