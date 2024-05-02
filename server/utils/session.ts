import { getServerSession } from '#auth';
import type { Session } from 'next-auth';

export async function getServerSessionChecked<TSkipSession extends boolean = false>(
	event: Parameters<typeof getServerSession>[0],
	skipCheck?: TSkipSession
): Promise<TSkipSession extends true ? Session | null : Session> {
	const session = await getServerSession(event);

	if (!session && !skipCheck) {
		throw createError({
			status: 401,
			message: 'Unauthorized'
		});
	}

	return session as any;
}
