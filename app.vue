<script lang="ts" setup>
	import { ModalsContainer } from 'vue-final-modal';
	useDarkMode();

	useHead({
		title: 'KBot2',
		htmlAttrs: {
			class: `nuxt-ui-scrollbars`
		}
	});
</script>

<template>
	<div>
		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<ModalsContainer />
	</div>
</template>
