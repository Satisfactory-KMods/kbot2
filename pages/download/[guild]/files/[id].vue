<script lang="ts" setup>
	import moment from 'moment';

	definePageMeta({
		name: 'download-file',
		middleware: ['auth', 'is-member', 'check-file']
	});

	const formatSize = useFormatSize();
	const params = useParams({ values: { guild: String(), id: String() } });

	const { data } = await useFetch(`/api/preview/guild/${params.guild}/download/${params.id}`);

	function getDownloadUrl(fileId: string | number) {
		return `/api/preview/guild/${params.guild}/download/${params.id}/${fileId}`;
	}
</script>

<template>
	<div class="full-wh">
		<NuxtLayout name="download" sizebox="md:max-w-full lg:max-w-5xl">
			<div v-if="!!data" class="flex flex-col gap-2">
				<div class="flex gap-2">
					<NuxtImg
						v-if="data.mod.logo"
						:src="data.mod.logo"
						width="48"
						height="48"
						class="rounded" />
					<Icon v-else name="material-symbols-light:public" class="h-12 w-12 rounded" />

					<div class="flex flex-1 flex-col">
						<span>{{ data.mod.name }} - v.{{ data.download.version }}</span>
						<span class="text-xs text-opacity-75">{{
							moment(data.download.uploaded_at).format('YYYY/MM/DD HH:mm')
						}}</span>
					</div>

					<NuxtLink
						:to="{
							name: data.download.patreon ? 'download-patreon' : 'download-public',
							params: { guild: params.guild }
						}">
						<Button icon="pi pi-angle-left" />
					</NuxtLink>
				</div>

				<Divider />

				<MDC
					:head="false"
					tag="article"
					:value="data.download.changelog.replace(/---(.*)(\r|\n)/g, '')"
					class="prose max-h-[40vh] w-full max-w-full overflow-auto whitespace-break-spaces dark:prose-invert" />

				<Divider />

				<NuxtLink
					v-for="item of data.files ?? []"
					:key="item.id"
					:href="getDownloadUrl(item.id)"
					target="_blank"
					class="select-card">
					<Icon name="ph:file-zip" class="h-12 w-12 rounded" />
					<div class="flex flex-1 flex-col">
						<span>{{ item.name }}</span>
						<span class="text-xs text-opacity-75">{{ formatSize(item.size) }}</span>
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
