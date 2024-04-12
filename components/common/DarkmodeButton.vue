<script lang="ts" setup>
	const { active, toggle } = useDarkMode();
</script>

<template>
	<Button v-ripple outlined :icon="active ? 'pi pi-moon' : 'pi pi-sun'" @click="toggle()">
		<slot />
	</Button>
</template>
