<script lang="ts" setup>
	import type { PropType } from 'vue';

	const params = useParams({
		values: {
			server: String()
		}
	});

	const props = defineProps({
		modelValue: {
			type: String,
			required: true
		},
		channelId: {
			type: [String, null] as PropType<string | null>,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		noEdit: {
			type: Boolean,
			default: false
		}
	});

	const {
		data: lastMessages,
		refresh: refreshMessages,
		pending: messagePending
	} = await useAsyncData(
		async () => {
			if (props.channelId) {
				// @ts-ignore
				return await $$fetch(
					`/api/server/${params.server}/channel/${props.channelId}/last-messages`,
					{
						method: 'GET',
						query: {
							limit: 10
						}
					}
				);
			}
			return [];
		},
		{
			watch: [
				() => {
					return props.channelId;
				}
			]
		}
	);

	const emit = defineEmits<(e: 'update:modelValue', v: string) => void>();

	const value = computed({
		get: () => {
			return props.modelValue;
		},
		set: (value: string) => {
			emit('update:modelValue', value);
		}
	});
</script>

<template>
	<div class="flex gap-2">
		<Dropdown
			v-model="value"
			:disabled="!!$props.disabled"
			:editable="!$props.noEdit"
			:options="(lastMessages ?? []).map((r) => r.id)"
			placeholder="Select a Message or type a Message Id"
			class="w-full">
			<template #value="slotProps">
				<div v-if="!!$props.disabled" class="flex items-center">
					{{ $props.disabled }}
				</div>
				<span v-else>
					{{ slotProps.placeholder }}
				</span>
			</template>
			<template #option="slotProps">
				<div class="flex items-center whitespace-break-spaces">
					({{ slotProps.option }})
					{{ (lastMessages ?? []).find((r) => r.id === slotProps.option)?.content }}
				</div>
			</template>
		</Dropdown>

		<Button
			:disabled="!!$props.disabled"
			size="small"
			type="button"
			icon="pi pi-refresh"
			label="Refresh"
			:loading="messagePending"
			@click="refreshMessages()" />
	</div>
</template>

<style></style>
