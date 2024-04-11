<script lang="ts" setup>
	const { status, signIn } = useAuth();
	const visible = ref(false);

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
		<Sidebar v-model:visible="visible">
			<template #header>
				<span class="inline-flex w-full items-center gap-1 px-2 py-2">
					<NuxtImg src="/images/logo.png" width="30" height="30" />
					<span class="text-xl font-medium">
						KBot<span class="text-primary-500 dark:text-primary-400">2</span>
					</span>
				</span>
			</template>
			<LayoutSidebar />
		</Sidebar>
		<LayoutSidebar class="hidden lg:block" />
		<slot />
		<div class="block lg:hidden">
			<Button label="Toggle Sidebar" icon="pi-bars" @click="visible = !visible" />
		</div>
	</div>
</template>
