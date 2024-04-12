import { defineStore } from 'pinia';
import type { DiscordServerBaseData } from '~/server/api/server/[guildId]/data.get';

export const useServerStore = defineStore('server-store', () => {
	const data = ref<DiscordServerBaseData>();
	const activeGuild = computed(() => {
		return String(data.value?.guild_id);
	});

	async function init(newGuild: string) {
		const result = await $fetch(`/api/server/${newGuild}/data`).catch((e) => {
			throw createError({
				statusCode: 500,
				message: e.message
			});
		});

		data.value = result;
		return result;
	}

	return { data, activeGuild, init };
});
