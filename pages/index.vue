<script lang="ts" setup>
	definePageMeta({
		layout: 'default-raw'
	});

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

					<a :href="String(config.discordInviteUrl)" target="_blank">
						<Button outlined label="Invite Kbot2" icon="pi-add" class="mt-2" />
					</a>
				</template>
			</Card>
		</div>
	</div>
</template>
