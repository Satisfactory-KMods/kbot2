<script lang="ts" setup>
	import { ModalsContainer } from 'vue-final-modal';
	useDarkMode();

	useHead({
		title: 'KBot2',
		htmlAttrs: {
			class: `nuxt-ui-scrollbars`
		},
		bodyAttrs: {
			class: `bg-white dark:bg-surface-950 dark:text-white dark:text-opacity-75 text-black layout-wrapper layout-news-active layout-ripple-disabled`
		}
	});
</script>

<template>
	<div class="full-wh overflow-auto">
		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<Toast position="bottom-right" />
		<ModalsContainer />
		<ConfirmDialog />
	</div>
</template>
