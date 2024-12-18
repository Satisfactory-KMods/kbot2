import { defineStore } from 'pinia';

export const useServerStore = defineStore('server-store', () => {
	const data = ref<Return<typeof refreshGuild>>({} as any);
	const config = ref<Return<typeof refreshConfig>>({} as any);
	const roles = ref<Return<typeof refreshRoles>>([]);
	const channels = ref<Return<typeof refreshChannels>>([]);
	const mods = ref<Return<typeof refreshMods>>({
		total: 0,
		mods: []
	});
	const loading = ref(false);

	const guildId: ComputedRef<string> = computed(() => {
		return String(data.value?.guild_id);
	});

	async function refreshConfig(newGuild?: string) {
		loading.value = true;
		const id = newGuild ?? guildId.value;

		// fetch roles
		const result = await $$fetch(`/api/server/${id}/config/general`, {
			method: 'GET'
		}).finally(async () => {
			await refreshMods().catch(() => {});
			loading.value = false;
		});
		config.value = result;

		return result;
	}

	async function refreshMods() {
		loading.value = true;

		// fetch roles
		const result = await $$fetch('/api/mods/byusers', {
			method: 'GET',
			query: {
				userIds: config.value.base.ficsit_user_ids,
				showHidden: true
			}
		}).finally(() => {
			loading.value = false;
		});
		mods.value = result;

		return result;
	}

	async function refreshRoles(newGuild?: string) {
		loading.value = true;
		const id = newGuild ?? guildId.value;

		// fetch roles
		const result = await $$fetch(`/api/server/${id}/roles`, {
			method: 'GET',
			query: {
				limit: 200,
				offset: 0
			}
		}).finally(() => {
			loading.value = false;
		});
		roles.value = result;

		return result;
	}

	async function refreshGuild(newGuild?: string) {
		loading.value = true;
		const id = newGuild ?? guildId.value;

		// fetch roles
		const result = await $$fetch(`/api/server/${id}/data`, { method: 'GET' }).finally(() => {
			loading.value = false;
		});
		data.value = result;

		return result;
	}

	async function refreshChannels(newGuild?: string) {
		loading.value = true;
		const id = newGuild ?? guildId.value;

		// fetch roles
		const result = await $$fetch(`/api/server/${id}/channels/${ChannelTypes.all}`, {
			method: 'GET'
		}).finally(() => {
			loading.value = false;
		});
		channels.value = result;

		return result;
	}

	async function init(newGuild: string) {
		await Promise.all([
			refreshGuild(newGuild),
			refreshRoles(newGuild),
			refreshChannels(newGuild),
			refreshConfig(newGuild)
		]);

		await refreshMods();

		return data.value;
	}

	return {
		data,
		refreshGuild,
		roles,
		refreshRoles,
		channels,
		refreshChannels,
		mods,
		config,
		refreshMods: refreshConfig,
		init,
		guildId,
		loading
	};
});
