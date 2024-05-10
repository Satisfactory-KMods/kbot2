import { installModTask } from './cacheMods';

export function installAllTasks() {
	installModTask('*/15 * * * *', true);
}
