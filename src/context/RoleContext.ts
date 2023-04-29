import { createContext } from "react";
import { DiscordRole }   from "@shared/types/discord";

const RoleContext = createContext<DiscordRole[]>( [] );

export {
	RoleContext
};