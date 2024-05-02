export default defineNuxtRouteMiddleware(async (to) => {
	if (!to.params.guild) {
		return abortNavigation({
			statusCode: 404,
			message: 'Guild not found'
		});
	}

	const { status } = useAuth();
	if (status.value !== 'authenticated') {
		return navigateTo(`/login?callbackUrl=${encodeURIComponent(to.fullPath)}&error=undefined`);
	}

	const file = await $$fetch(`/api/preview/guild/${to.params.guild}/download/${to.params.id}`, {
		method: 'GET'
	}).catch(() => {
		return createError({
			statusCode: 500,
			message: 'Internal Server Error',
			fatal: true
		});
	});

	if (!isNuxtError(file) && !file.download.patreon) {
		return;
	} else if (isNuxtError(file)) {
		return file;
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

	if (!isNuxtError(result) && !result.isPatreon) {
		return createError({
			statusCode: 401,
			message: 'You need to be a patreon to access this page'
		});
	} else if (isNuxtError(result)) {
		return result;
	}
});
