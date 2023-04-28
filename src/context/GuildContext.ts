import { createContext } from "react";
import { MO_Guild }      from "@shared/types/MongoDB";

const GuildContext = createContext( {
	guildData: {} as MO_Guild,
	triggerGuildUpdate: async() => {
	}
} );

export default GuildContext;