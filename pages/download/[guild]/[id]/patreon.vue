<script lang="ts" setup>
	const { status, data, lastRefreshedAt, signIn, signOut } = useAuth();

	definePageMeta({
		middleware: 'auth'
	});
</script>

<template>
	<div>
		<div class="block">{{ data?.user.name }}</div>
		<div class="block">{{ status }}</div>
		<div class="block">{{ lastRefreshedAt }}</div>
		<Button @click="signIn('discord')">Sign In</Button>
		<Button @click="signOut()">Logout</Button>
	</div>
</template>
