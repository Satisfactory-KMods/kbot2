<script lang="ts" setup>
	const confirm = useConfirm();
	const toast = useToast();
	const { params } = useParams({
		values: {
			server: String()
		}
	});

	const { data: config, refresh: refreshConfig } = await useFetch(
		`/api/server/${params.server}/config/general`,
		{
			method: 'GET'
		}
	);

	const { data: channels, refresh: refreshChannels } = await useFetch(
		`/api/server/${params.server}/channels/${ChannelTypes.text}`,
		{
			method: 'GET'
		}
	);
</script>

<template>
	<div>
		<div class="md:px-2">
			<Panel
				:pt="{
					content: 'p-0'
				}"
				header="Manage Mod Announcements">
				<div v-if="config" class="flex flex-col gap-2 p-2">
					<ToggleButton
						v-model="config.base.changelog_announce_hidden_mods"
						on-label="Enabled"
						off-label="Disabled"
						on-icon="pi pi-check"
						off-icon="pi pi-times"
						class="w-[9rem]" />
				</div>
			</Panel>
		</div>
	</div>
</template>

<style lang="postcss"></style>
