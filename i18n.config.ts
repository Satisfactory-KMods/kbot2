import { de } from './i18n/de';
import { en } from './i18n/en';

export default defineI18nConfig(() => {
	return {
		legacy: false,
		locale: 'de',
		messages: {
			en,
			de
		}
	};
});
