<script lang="ts" setup>
	import moment from 'moment-timezone';

	const store = useServerStore();
</script>

<template>
	<div class="flex flex-col gap-2 pb-0 pt-2 md:px-2 xl:flex-row">
		<!-- Server -->
		<Card
			:pt="{
				body: '',
				content: 'p-4'
			}"
			class="w-full justify-end rounded-none md:rounded-lg">
			<template #content>
				<div class="flex items-center gap-2">
					<span class="flex flex-1 items-center gap-3 text-xl font-semibold">
						<NuxtImg
							:src="store.data.icon || FallbackImage"
							width="64"
							height="64"
							class="rounded" />
						<div class="flex flex-1 flex-col">
							<span class="text-2xl font-medium">
								{{ store.data.name }}
							</span>
							<span class="text-xs">
								Since {{ moment(store.data.name).format('MMMM Do YYYY') }}
							</span>
						</div>
					</span>
				</div>
			</template>
		</Card>

		<!-- Users Online -->
		<Card
			:pt="{
				body: '',
				content: 'p-4'
			}"
			class="w-full justify-end rounded-none md:rounded-lg">
			<template #content>
				<div class="flex items-center gap-2">
					<span class="flex flex-1 items-center gap-3 text-xl font-semibold">
						<Icon name="heroicons:users-16-solid" class="h-16 w-16 text-4xl" />
						<div class="flex flex-1 flex-col">
							<span class="text-2xl font-medium"> Members Online </span>
							<ProgressBar
								:value="(store.data.online_users / store.data.count_users) * 100">
								{{ store.data.online_users }} / {{ store.data.count_users }} ({{
									(
										(store.data.online_users / store.data.count_users) *
										100
									).toPrecision(2)
								}}%)
							</ProgressBar>
						</div>
					</span>
				</div>
			</template>
		</Card>

		<!-- Users Online -->
		<Card
			:pt="{
				body: '',
				content: 'p-4'
			}"
			class="w-full justify-end rounded-none md:rounded-lg">
			<template #content>
				<div class="flex items-center gap-2">
					<span class="flex flex-1 items-center gap-3 text-xl font-semibold">
						<Icon name="heroicons:star" class="h-16 w-16 text-4xl" />
						<div class="flex flex-1 flex-col">
							<span class="text-2xl font-medium"> Premium Users </span>
							<ProgressBar
								v-if="store.data.premium_subscription_count > 0"
								:value="(store.data.premium_subscription_count / 15) * 100">
								{{ store.data.premium_subscription_count }} / 15 ({{
									(
										(store.data.premium_subscription_count / 15) *
										100
									).toPrecision(2)
								}}%)
							</ProgressBar>
							<div v-else>
								<span class="text-xs font-medium"> No Premium Users </span>
							</div>
						</div>
					</span>
				</div>
			</template>
		</Card>
	</div>
</template>

<style></style>
