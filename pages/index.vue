<script lang="ts" setup>
	import AuthUserDropdown from '~/components/common/AuthUserDropdown.vue';
	import DarkmodeButton from '~/components/common/DarkmodeButton.vue';

	definePageMeta({
		layout: 'default-raw'
	});

	const { data } = await useFetch('/api/servers', { method: 'GET' });

	if (!data.value) {
		throw createError({
			status: 404,
			message: 'Failed to fetch data from the server',
			fatal: true
		});
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
						<span class="flex-1 text-xl font-semibold"> Please Pick a Server </span>

						<AuthUserDropdown />
						<DarkmodeButton />
					</div>
				</template>
			</Card>
			<Card
				:pt="{
					body: '',
					content: 'p-6'
				}"
				class="w-full justify-end rounded-none md:rounded-lg">
				<template #title> </template>
				<template #content>
					<Message v-if="!data?.length" :closable="false">
						<div class="block">
							No Server Found. Please invite the bot to your server and try it again.
						</div>
					</Message>

					<div
						class="flex max-h-96 w-full flex-col gap-2 overflow-y-auto overflow-x-hidden">
						<HomeServerCard
							v-for="server of data"
							:key="server.guild_id"
							:data="server" />
					</div>

					<ButtonGroup>
						<NuxtLink
							external
							:href="config.discordInviteUrl"
							target="_blank"
							class="block w-full">
							<Button class="mt-2 w-full">
								<Icon name="mdi:robot" class="mr-2" />
								Invite KBot2
							</Button>
						</NuxtLink>
					</ButtonGroup>
				</template>
			</Card>
		</div>
	</div>
</template>
