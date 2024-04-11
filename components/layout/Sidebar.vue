<script lang="ts" setup>
	import type { MenuItem } from 'primevue/menuitem';

	const { params } = useParams({ values: { guild: String() } });
	const { mt, t } = useLang('navigation.sidebar');
	const { signOut, data } = useAuth();

	function checkParams() {
		if (!params.guild) {
			throw createError({
				status: 404,
				message: t('error.not-found'),
				fatal: true
			});
		}
	}

	const items = ref<MenuItem[]>([
		{
			separator: true
		},
		{
			label: 'dashboard',
			items: [
				{
					label: 'home',
					url: `/server/${params.guild}/`,
					icon: 'pi-home'
				}
			]
		},
		{
			label: 'servers',
			items: [
				{
					label: 'server-overview',
					url: `/`,
					icon: 'pi-server'
				}
			]
		},
		{
			separator: true
		}
	]);
</script>

<template>
	<Menu :model="items">
		<template #start>
			<div
				v-if="data?.user"
				class="p-link dark:text-surface-0/80 relative flex w-full cursor-default items-center overflow-hidden rounded-none p-2 pl-3">
				<Avatar :image="data.user.image" class="mr-2" shape="circle" />
				<span class="inline-flex flex-col justify-start">
					<span class="font-bold">{{ data.user.name }}</span>
					<span class="text-sm">
						{{ mt('user-discord-id', { id: data.user.discordId }) }}
					</span>
					<Button
						size="small"
						class="mt-1"
						icon="pi pi-sign-out"
						:label="mt('logout')"
						@click="signOut()" />
				</span>
			</div>
		</template>
		<template #submenuheader="{ item }">
			<span class="font-bold leading-none text-primary-500 dark:text-primary-400">
				{{ mt(String(item.label)) }}
			</span>
		</template>
		<template #item="{ item, props }">
			<NuxtLink v-ripple :href="item.url" class="flex items-center" v-bind="props.action">
				<span :class="item.icon" />
				<span class="ml-2">{{ mt(String(item.label)) }}</span>
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
