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
			default: 'Select a Mod'
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

	const { mods, refreshMods, loading: isLoading } = useServerStore();

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
			:editable="!$props.noEdit"
			filter
			:placeholder="$props.placeholder"
			:options="(mods.mods ?? []).map((r) => r.mod_reference)"
			class="w-full">
			<template #value="slotProps">
				<div v-if="!!slotProps.value.length" class="flex items-center">
					{{
						slotProps.value
							.map(
								(id: any) =>
									(mods.mods ?? []).find((r) => r.mod_reference === id)?.name
							)
							.filter((r: any) => !!r)
							.join(', ')
					}}
				</div>
				<span v-else> {{ slotProps.placeholder }} </span>
			</template>
			<template #option="slotProps">
				<div class="flex items-center">
					{{ (mods.mods ?? []).find((r) => r.mod_reference === slotProps.option)?.name }}
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
			@click="refreshMods()" />
	</div>
</template>

<style></style>
