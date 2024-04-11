<script lang="ts" setup>
	const { status, signIn } = useAuth();

	if (status.value !== 'authenticated') {
		await signIn('discord');

		throw createError({
			status: 302,
			message: 'Unauthorized'
		});
	}

	watch(status, async (newStatus) => {
		if (newStatus === 'authenticated') {
			await signIn('discord');

			throw createError({
				status: 302,
				message: 'Unauthorized'
			});
		}
	});
</script>

<template>
	<div v-if="status === 'authenticated'">
		<slot />
	</div>
</template>
