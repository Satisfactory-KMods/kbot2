<script lang="ts" setup>
	const toast = useToast();
	const busy = ref(false);
	const { params } = useParams({
		values: {
			server: String()
		}
	});

	const { data: config, refresh } = await useFetch(
		`/api/server/${params.server}/config/general`,
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

	async function saveSettings() {
		if (busy.value || !config.value) {
			return;
		}

		const {
			ficsit_user_ids,
			update_text_channel_id,
			changelog_announce_hidden_mods,
			changelog_forum_id,
			changelog_bug_channel_id,
			changelog_suggestion_channel_id
		} = config.value.base;

		busy.value = true;
		const result = await $$fetch(`/api/server/${params.server}/config/general`, {
			method: 'POST',
			body: {
				ficsit_user_ids,
				update_text_channel_id,
				changelog_announce_hidden_mods,
				changelog_forum_id,
				changelog_bug_channel_id,
				changelog_suggestion_channel_id
			}
		}).catch((e: any) => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed to save settings: ${e.message}`,
				life: 3000
			});
			return null;
		});
		busy.value = false;

		if (result) {
			toast.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Settings saved successfully',
				life: 3000
			});
			await refresh();
		}
	}
</script>

<template>
	<div>
		<div class="md:px-2">
			<Panel header="Manage Mod Announcements">
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

					<div class="flex flex-col gap-1">
						<span>Channel for Changelogs</span>
						<CommonChannelSelection
							v-model="config.base.update_text_channel_id"
							no-edit
							:channel-types="[ChannelTypes.text, ChannelTypes.forum]" />
					</div>

					<div class="flex flex-col gap-1">
						<span>Channel for Changelogs <b>(only as Forum)</b></span>
						<CommonChannelSelection
							v-model="config.base.changelog_forum_id"
							no-edit
							:channel-types="[ChannelTypes.forum]" />
					</div>

					<div class="flex flex-col gap-1">
						<span>Channel for Suggestions</span>
						<CommonChannelSelection
							v-model="config.base.changelog_suggestion_channel_id"
							no-edit
							:channel-types="[ChannelTypes.text, ChannelTypes.forum]" />
					</div>

					<div class="flex flex-col gap-1">
						<span>Channel for Bugreports</span>
						<CommonChannelSelection
							v-model="config.base.changelog_bug_channel_id"
							no-edit
							:channel-types="[ChannelTypes.text, ChannelTypes.forum]" />
					</div>

					<Button :loading="busy" @click="saveSettings()">Save</Button>
				</div>
			</Panel>
		</div>
	</div>
</template>

<style lang="postcss"></style>
