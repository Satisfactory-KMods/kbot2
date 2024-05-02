<template>
	<div class="flex h-full flex-col items-center justify-center">
		<div class="flex w-full flex-col gap-2 md:max-w-2xl" :class="$attrs.sizebox">
			<Card
				:pt="
					Object.assign(
						{
							body: '',
							content: 'p-4'
						},
						$attrs.pt ?? {}
					)
				"
				class="w-full justify-end rounded-none md:rounded-lg">
				<template #content>
					<div class="flex items-center gap-2">
						<span class="flex flex-1 gap-3 text-xl font-semibold">
							<NuxtImg src="/images/logo.png" width="32" height="32" />
							<span class="text-2xl font-medium">
								KBot<span class="text-primary-500 dark:text-primary-400"
									>2 Webinterface</span
								>
							</span>
						</span>

						<CommonAuthUserDropdown />
						<CommonDarkmodeButton />
					</div>
				</template>
			</Card>
			<Card
				:pt="{
					body: '',
					content: 'p-6'
				}"
				class="w-full justify-end rounded-none md:rounded-lg">
				<template #content>
					<slot />
				</template>
			</Card>
		</div>
	</div>
</template>
