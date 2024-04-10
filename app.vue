<script lang="ts" setup>
	const { status, signIn } = useAuth();

	if (status.value !== 'authenticated') {
		signIn('discord');
	}

	watch(status, (newStatus) => {
		if (newStatus === 'authenticated') {
			signIn('discord');
		}
	});
</script>

<template>
	<div v-if="status === 'authenticated'">
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
