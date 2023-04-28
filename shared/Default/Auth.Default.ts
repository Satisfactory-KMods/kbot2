import { MO_UserAccount } from "@shared/types/MongoDB";
import { ERoles }         from "@shared/Enum/ERoles";

export const DefaultUser : MO_UserAccount = {
	discordId: "",
	_id: "",
	username: "Default User",
	role: ERoles.member
};
