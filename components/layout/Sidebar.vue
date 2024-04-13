<script lang="ts" setup>
	const { signOut, data } = useAuth();

	const items = useNavigationUrls();
</script>

<template>
	<Menu :model="items">
		<template #start>
			<div
				v-if="data?.user"
				class="p-link relative flex w-full cursor-default items-center overflow-hidden rounded-none p-2 pl-3 dark:text-surface-0/80">
				<Avatar :image="data.user.image" class="mr-2" shape="circle" />
				<span class="inline-flex flex-1 flex-col justify-start">
					<span class="font-bold">{{ data.user.name }}</span>
					<span class="text-sm"> ID: {{ data.user.discordId }} </span>
				</span>
				<div class="mt-1 flex gap-2">
					<Button size="small" icon="pi pi-sign-out" @click="signOut()" />
				</div>
			</div>
		</template>
		<template #submenuheader="{ item }">
			<span class="font-bold leading-none text-primary-500 dark:text-primary-400">
				{{ String(item.label) }}
			</span>
		</template>
		<template #item="{ item, props }">
			<NuxtLink v-ripple :href="item.url" class="flex items-center" v-bind="props.action">
				<span :class="item.icon" />
				<span class="ml-2">{{ String(item.label) }}</span>
				<Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
				<span
					v-if="item.shortcut"
					class="ml-auto rounded-md border border-surface-200 bg-surface-100 p-1 text-xs dark:border-surface-700 dark:bg-surface-700">
					{{ item.shortcut }}
				</span>
			</NuxtLink>
		</template>
	</Menu>
</template>

<style></style>
