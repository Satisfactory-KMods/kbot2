<script lang="ts" setup>
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
			<Card class="w-full justify-end rounded-none md:rounded-lg">
				<template #title> Please Pick a Server </template>
				<template #content>
					<Message :closable="false">
						<div class="block">
							No Server Found. Please invite the bot to your server and try it again.
						</div>
					</Message>

					<NuxtLink
						v-for="server of data"
						:key="server.guild_id"
						:href="`/guild/${server.guild_id}`">
						<Button outlined :label="server.name" icon="pi-add" class="mt-2" />
					</NuxtLink>

					<ButtonGroup>
						<a :href="config.discordInviteUrl" target="_blank" class="block w-full">
							<Button class="mt-2 w-full">
								<Icon name="mdi:robot" class="mr-2" />
								Invite Kbot2
							</Button>
						</a>
					</ButtonGroup>
				</template>
			</Card>
		</div>
	</div>
</template>
