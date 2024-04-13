<script lang="ts" setup>
	const items = useNavigationUrls();
</script>

<template>
	<div class="flex h-full flex-col gap-2 md:px-2">
		<template v-for="(item, idx) of items" :key="idx">
			<div v-if="!item.separator">
				<div
					class="px-2 py-2 text-xl font-bold leading-none text-primary-500 dark:text-primary-400 md:px-0">
					{{ item.label }}
				</div>

				<div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
					<NuxtLink
						v-for="(subItem, subIdx) of item.items ?? []"
						:key="subIdx"
						:to="subItem.url">
						<Card
							:pt="{
								root: [
									//Shape
									'rounded-lg',
									'shadow-md',
									'cursor-pointer',

									//Color
									'hover:bg-primary-50 bg-surface-0 dark:bg-surface-900 hover:dark:bg-surface-700',
									'hover:dark:text-primary-500 hover:text-primary-700 text-surface-700 dark:text-surface-0/80'
								],
								body: '',
								content: 'p-4'
							}"
							class="w-full justify-end rounded-none md:rounded-lg">
							<template #content>
								<div class="flex items-center gap-2">
									<span
										class="flex flex-1 items-center gap-3 text-xl font-semibold">
										<i :class="subItem.icon" class="h-10 w-10 text-4xl" />
										<div class="flex flex-1 flex-col">
											<span class="text-2xl font-medium">
												{{ subItem.label }}
											</span>
											<span v-if="subItem.description" class="text-xs">
												{{ subItem.description }}
											</span>
										</div>
									</span>
								</div>
							</template>
						</Card>
					</NuxtLink>
				</div>
			</div>
		</template>
	</div>
</template>
