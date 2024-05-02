<script lang="ts" setup>
	const { signOut, data: session } = useAuth();

	const items = ref([
		{
			label: 'Logout',
			icon: 'pi pi-sign-out',
			command: () => {
				signOut();
			}
		}
	]);
</script>

<template>
	<SplitButton
		v-if="session"
		:model="items"
		icon="pi pi-plus"
		class="dark:primary-400 rounded-md bg-primary-500">
		<NuxtImg alt="logo" :src="session.user.image" height="20" width="20" class="me-2 rounded" />
		<span class="mr-2 flex items-center font-bold">{{ session.user.name }}</span>
	</SplitButton>
</template>

<style></style>
