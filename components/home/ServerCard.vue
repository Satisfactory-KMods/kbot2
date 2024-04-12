<script lang="ts" setup>
	import type { DiscordServerByUser } from '~/server/api/servers.get';

	defineProps({
		data: {
			type: Object as PropType<DiscordServerByUser[0]>,
			required: true
		}
	});
</script>

<template>
	<NuxtLink :href="`/guild/${$props.data.guild_id}`" class="server-card">
		<NuxtImg
			width="48"
			height="48"
			class="h-12 w-12 rounded"
			:alt="$props.data.name"
			:src="$props.data.image || FallbackImage" />
		<div class="flex flex-1 flex-col">
			<span>{{ $props.data.name }}</span>
			<span class="text-xs text-opacity-75">
				<b>{{ $props.data.total_members }}</b> Members
			</span>
		</div>
	</NuxtLink>
</template>

<style lang="postcss" scoped>
	.server-card {
		@apply dark:bg-surface-800;
		@apply hover:bg-gray-100 hover:dark:bg-surface-700;
		@apply border border-surface-200 dark:border-surface-700;
		@apply flex w-full cursor-pointer items-center gap-4 rounded p-2;
		@apply transition-all duration-100;
	}
</style>
