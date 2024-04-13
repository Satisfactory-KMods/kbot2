<script lang="ts" setup>
	const { signIn, status } = useAuth();
	const { showAbout, showPolicy } = useGlobalStates();

	if (status.value === 'authenticated') {
		useRouter().replace('/');
	}

	const config = useRuntimeConfig().public;
</script>

<template>
	<div class="flex h-full flex-col items-center justify-center">
		<div class="flex w-full flex-col gap-2 md:max-w-2xl">
			<Card
				:pt="{
					body: '',
					content: 'p-4'
				}"
				class="w-full justify-end rounded-none md:rounded-lg">
				<template #content>
					<div class="flex items-center gap-2">
						<span class="flex flex-1 gap-3 text-xl font-semibold">
							<NuxtImg src="/images/logo.png" width="32" height="32" />
							<span class="text-2xl font-medium">
								Welcome to the KBot<span
									class="text-primary-500 dark:text-primary-400"
									>2 Webinterface</span
								>
							</span>
						</span>

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
					<p class="py-2">
						Before you can use the webinterface, you need to login with your Discord
						account. This allow us to verify your identity and give you access to the
						correct servers and the allowed downloads for previews and other data.
						<br />
					</p>
					<p class="py-2">Please click on the button below to login.</p>

					<Divider />

					<Button
						class="w-full"
						@click="
							signIn('discord', {
								callbackUrl: String($route.query.callbackUrl)
							})
						">
						<Icon name="mdi:discord" class="mr-2" />
						Login with Discord
					</Button>

					<Divider />

					<div class="mt-2 flex w-full gap-2">
						<Button severity="secondary" class="w-full" @click="showAbout = !showAbout">
							<Icon name="heroicons:book-open" class="mr-2" />
							About
						</Button>

						<Button
							severity="secondary"
							class="w-full"
							@click="showPolicy = !showPolicy">
							<Icon name="heroicons:book-open" class="mr-2" />
							Private Policy
						</Button>
					</div>

					<div class="mt-2 flex w-full gap-2">
						<NuxtLink external class="flex-1" :href="config.githubRepo" target="_blank">
							<Button severity="secondary" class="w-full">
								<Icon name="mdi:github" class="me-2" />
								Github (Source)
							</Button>
						</NuxtLink>
						<NuxtLink
							external
							class="flex-1"
							:href="config.discordSupport"
							target="_blank">
							<Button severity="secondary" class="w-full">
								<Icon name="ic:baseline-discord" class="mr-2" />
								Our Discord
							</Button>
						</NuxtLink>
						<NuxtLink external class="flex-1" :href="config.patreonUrl" target="_blank">
							<Button severity="secondary" class="w-full">
								<Icon name="ph:patreon-logo-duotone" class="mr-2" />
								Support Us
							</Button>
						</NuxtLink>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>
