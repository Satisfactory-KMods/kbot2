import { JobTask } from "../TaskManager";

export default new JobTask(
	1800000 * 2,
	"MakeItClean",
	async() => {
	}
);
