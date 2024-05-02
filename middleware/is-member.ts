export default defineNuxtRouteMiddleware(async (to) => {
	if (!to.params.guild) {
		return createError({
			statusCode: 404,
			message: 'Guild not found',
			fatal: true
		});
	}

	const { status } = useAuth();
	if (status.value !== 'authenticated') {
		return navigateTo(`/login?callbackUrl=${encodeURIComponent(to.fullPath)}&error=undefined`);
	}

	const result = await $$fetch(`/api/server/${to.params.guild}/is-member`, {
		method: 'GET'
	}).catch(() => {
		return createError({
			statusCode: 500,
			message: 'Internal Server Error',
			fatal: true
		});
	});

	if (!isNuxtError(result) && !result.isMember) {
		return createError({
			statusCode: 401,
			message: 'You need to be a member of this server to access this page',
			fatal: true
		});
	} else if (isNuxtError(result)) {
		return result;
	}
});
