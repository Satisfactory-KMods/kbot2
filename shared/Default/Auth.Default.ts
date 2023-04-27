import { IMO_UserAccount } from "@shared/types/MongoDB";
import { ERoles }          from "@shared/Enum/ERoles";

export const DefaultUser : IMO_UserAccount = {
	discordId: "",
	_id: "",
	username: "Default User",
	role: ERoles.member
};
