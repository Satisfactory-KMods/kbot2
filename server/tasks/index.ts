import { installModTask } from './cacheMods';
import { checkForModUpdates } from './cacheMods_checkForUpdates';

export function installAllTasks() {
	installModTask('*/15 * * * *', true);
	setTimeout(checkForModUpdates, 3000);
}
