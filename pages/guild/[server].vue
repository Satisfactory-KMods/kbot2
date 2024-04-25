<script lang="ts" setup>
	const { status, signIn } = useAuth();
	const visible = ref(false);
	const store = useServerStore();

	const params = useParams({
		values: {
			server: String()
		}
	});

	definePageMeta({
		middleware: 'auth'
	});

	if (status.value !== 'authenticated') {
		signIn('discord');
	}

	// init store and check if server exists or user has access to it
	const result = await store.init(params.server);
	if (!result) {
		throw createError({
			statusCode: 404,
			message: 'Server not found or you do not have access to it.'
		});
	}

	watch(status, (newStatus) => {
		if (newStatus === 'authenticated') {
			signIn('discord');
		}
	});

	const params2 = useSearchParams({
		values: {
			test: String(20)
		},
		customParser: (params) => {
			return {
				test: Number(params.test)
			};
		}
	});
</script>

<template>
	<div v-if="status === 'authenticated'" class="full-wh flex flex-col overflow-hidden">
		<LayoutTopNav v-model="visible" />
		<div class="flex flex-1 overflow-hidden">
			<Sidebar
				v-model:visible="visible"
				:pt="{
					content: ''
				}">
				<template #header>
					<span class="inline-flex w-full items-center gap-1 px-2 py-2">
						<NuxtImg src="/images/logo.png" width="30" height="30" />
						<span class="text-xl font-medium">
							KBot<span class="text-primary-500 dark:text-primary-400"
								>2 Webinterface</span
							>
						</span>
					</span>
				</template>
				<LayoutSidebar />
			</Sidebar>
			<div class="layout-border-color hidden w-96 overflow-auto border-r 2xl:block">
				<LayoutSidebar />
			</div>
			<div class="flex flex-1 flex-col overflow-auto">
				<LayoutStateBar />
				<Divider />
				<NuxtPage />
			</div>
		</div>
	</div>
</template>

<style lang="postcss">
	.layout-border-color {
		@apply border-primary-400 dark:border-primary-800;
	}
</style>
