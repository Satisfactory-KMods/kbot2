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

	function onSetFicitUserIds(ids: string[]) {
		if (!config.value) {
			return;
		}
		config.value.base.ficsit_user_ids = Array.from(new Set(ids));
	}
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
					<div class="flex flex-col gap-1">
						<span>Ficsit.App User ids</span>
						<span class="text-xs text-opacity-70"
							>Ids can be found in the URL of a user profile on Fiscit.App
							"https://ficsit.app/user/<b>9uvZtCA4cM6H4q</b>"</span
						>
						<Chips
							:model-value="config.base.ficsit_user_ids"
							class="w-full"
							@update:model-value="onSetFicitUserIds" />
					</div>

					<div class="flex items-center gap-2">
						<ToggleButton
							v-model="config.base.changelog_announce_hidden_mods"
							on-label="Enabled"
							off-label="Disabled"
							on-icon="pi pi-check"
							off-icon="pi pi-times" />
						<span>Announce Mod updates from Hidden mods</span>
					</div>
				</div>
			</Panel>
		</div>
	</div>
</template>

<style lang="postcss"></style>
