<script lang="ts" setup>
	definePageMeta({
		name: 'download',
		middleware: 'auth'
	});

	const params = useParams({ values: { guild: String() } });
	const { data } = await useFetch(`/api/server/${params.guild}/is-member`);
</script>

<template>
	<div class="full-wh">
		<NuxtLayout name="download">
			<div class="flex flex-col gap-2">
				<NuxtLink
					:href="{
						name: `download-public`,
						params
					}"
					class="select-card">
					<Icon name="material-symbols-light:public" class="h-8 w-8 rounded" />
					<div class="flex flex-1 flex-col">
						<span>Public Downloads</span>
					</div>
				</NuxtLink>
				<NuxtLink
					v-if="data?.isPatreon"
					:href="{
						name: `download-patreon`,
						params
					}"
					class="select-card">
					<Icon name="ph:patreon-logo-duotone" class="h-8 w-8 rounded" />
					<div class="flex flex-1 flex-col">
						<span>Patreon Downloads</span>
					</div>
				</NuxtLink>
			</div>
		</NuxtLayout>
	</div>
</template>

<style lang="postcss" scoped>
	.select-card {
		@apply dark:bg-surface-800;
		@apply hover:bg-gray-100 hover:dark:bg-surface-700;
		@apply border border-surface-200 dark:border-surface-700;
		@apply flex w-full cursor-pointer items-center gap-4 rounded p-2;
		@apply transition-all duration-100;
	}
</style>
