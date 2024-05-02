<script lang="ts" setup>
	const props = defineProps({
		modelValue: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 'Select a Role'
		},
		loading: {
			type: Boolean,
			default: false
		}
	});

	const emit = defineEmits<(e: 'update:modelValue', v: string) => void>();

	const { roles: allRoles, refreshRoles, loading: isLoading } = useServerStore();

	const value = computed<string>({
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
			:placeholder="$props.placeholder"
			:options="(allRoles ?? []).map((r) => r.id)"
			class="w-full">
			<template #value="slotProps">
				<div v-if="!!slotProps.value" class="flex items-center">
					{{
						(allRoles ?? []).find((r) => r.id === slotProps.value)?.name ??
						slotProps.value
					}}
				</div>
				<span v-else> {{ slotProps.placeholder }} </span>
			</template>
			<template #option="slotProps">
				<div class="flex items-center">
					{{ (allRoles ?? []).find((r) => r.id === slotProps.option)?.name }}
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
			@click="refreshRoles()" />
	</div>
</template>

<style></style>
