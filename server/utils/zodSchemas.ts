import { z } from 'zod';

export function zodNumeric(test: unknown, message?: string) {
	return z
		.string()
		.regex(/^[0-9]*$/, message)
		.parse(test);
}

export function zodUuid(test: unknown, message?: string) {
	return z.string().uuid(message).parse(test);
}
