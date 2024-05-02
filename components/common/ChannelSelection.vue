<script lang="ts" setup>
	import type { ValueOf } from '@kmods/drizzle-pg/pg-core';
	import type { PropType } from 'vue';

	const props = defineProps({
		modelValue: {
			type: String,
			required: true
		},
		channelTypes: {
			type: [Array, String] as PropType<
				ValueOf<typeof ChannelTypes>[] | ValueOf<typeof ChannelTypes>
			>,
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

	const emit = defineEmits<(e: 'update:modelValue', v: string) => void>();

	const { channels: allChannels, refreshChannels, loading: isLoading } = useServerStore();

	const channels = computed(() => {
		return allChannels.filter((r) => {
			if (typeof props.channelTypes === 'string') {
				return r.type === props.channelTypes;
			}

			return props.channelTypes.includes(r.type);
		});
	});

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
			:options="(channels ?? []).map((r) => r.id)"
			placeholder="Select a Channel"
			class="w-full">
			<template #value="slotProps">
				<div v-if="slotProps.value" class="flex items-center">
					{{ (channels ?? []).find((r) => r.id === slotProps.value)?.name }}
				</div>
				<span v-else> {{ slotProps.placeholder }} </span>
			</template>
			<template #option="slotProps">
				<div class="flex items-center">
					{{ (channels ?? []).find((r) => r.id === slotProps.option)?.name }}
				</div>
			</template>
		</Dropdown>

		<Button
			:disabled="!!$props.disabled"
			size="small"
			type="button"
			icon="pi pi-refresh"
			label="Refresh"
			:loading="!!$props.loading || isLoading"
			@click="refreshChannels()" />
	</div>
</template>

<style></style>
