<script lang="ts" setup>
	import moment from 'moment';
	definePageMeta({
		name: 'download-public',
		middleware: ['auth', 'is-member']
	});

	const params = useParams({ values: { guild: String() } });
	const searchParams = useSearchParams({
		values: {
			limit: String(20),
			offset: String(0)
		},
		customParser: (query) => {
			return {
				...query,
				limit: Math.min(Math.max(parseInt(query.limit), 1), 100),
				offset: Math.max(parseInt(query.offset), 0)
			};
		}
	});

	const { data } = await useFetch(`/api/preview/guild/${params.guild}/list-public`, {
		query: searchParams
	});
</script>

<template>
	<div class="full-wh">
		<NuxtLayout name="download">
			<div class="flex flex-col gap-2">
				<NuxtLink
					v-for="item of data?.downloads ?? []"
					:key="item.id"
					:href="{
						name: `download-file`,
						params: {
							...params,
							id: item.id
						}
					}"
					class="select-card">
					<NuxtImg
						v-if="item.mod.logo"
						:src="item.mod.logo"
						width="48"
						height="48"
						class="rounded" />
					<Icon v-else name="material-symbols-light:public" class="h-12 w-12 rounded" />
					<div class="flex flex-1 flex-col">
						<span>{{ item.mod.name }} - v.{{ item.version }}</span>
						<span class="text-xs text-opacity-75">{{
							moment(item.uploaded_at).format('YYYY/MM/DD HH:mm')
						}}</span>
					</div>
				</NuxtLink>

				<div class="flex items-center">
					<NuxtLink :to="{ name: 'download', params }">
						<Button icon="pi pi-angle-left" />
					</NuxtLink>
					<Paginator
						v-if="(data?.total ?? 0) > searchParams.limit"
						v-model:first="searchParams.offset"
						:rows="searchParams.limit"
						:total-records="data?.total ?? 0"
						class="flex-1 rounded-lg">
						<template #start="slotProps">
							Showing {{ slotProps.state.first + 1 }} to
							{{
								Math.min(
									slotProps.state.first + 1 + searchParams.limit - 1,
									data?.total ?? 0
								)
							}}
							of {{ data?.total ?? 0 }}
						</template>
					</Paginator>
				</div>
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
