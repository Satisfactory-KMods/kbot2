<script lang="ts" setup>
	defineProps({
		modelValue: {
			type: Boolean,
			required: true
		}
	});

	defineEmits<(e: 'update:modelValue', v: boolean) => void>();
</script>

<template>
	<div class="layout-border-color flex items-center gap-2 border-b p-3">
		<span class="inline-flex w-full flex-1 items-center gap-3">
			<NuxtImg src="/images/logo.png" width="32" height="32" />
			<span class="text-2xl font-medium">
				KBot<span class="text-primary-500 dark:text-primary-400">2 Webinterface</span>
			</span>
		</span>
		<NuxtLink to="/">
			<Button v-ripple outlined icon="pi pi-server" />
		</NuxtLink>
		<CommonDarkmodeButton />

		<Button
			v-ripple
			class="mx-3 block 2xl:hidden"
			link
			icon="pi pi-bars"
			@click="$emit('update:modelValue', !$props.modelValue)" />
	</div>
</template>

<style></style>
