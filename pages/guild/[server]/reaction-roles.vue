<script lang="ts" setup>
	import cloneDeep from 'lodash/cloneDeep';
	import type { ReactionRoleData } from '~/server/api/server/[guildId]/reaction-roles.get';
	import EmojiPicker from 'vue3-emoji-picker';

	const setIndex = ref(0);
	const op = ref();
	const darkMode = useDarkMode();
	const confirm = useConfirm();
	const toast = useToast();
	const { params } = useParams({
		values: {
			server: String()
		}
	});

	function toggleEmojiSelect(event: Event, idx: number) {
		setIndex.value = idx;
		op.value.toggle(event);
	}

	const { reffer: searchParams } = useSearchParams({
		values: {
			limit: String(20),
			offset: String(0)
		},
		customParser: (query) => {
			return {
				...query,
				limit: Math.min(Math.max(parseInt(query.limit), 1), 100),
				offset: Math.max(parseInt(query.offset), 0)
			};
		}
	});

	const defaultData = computed<ReactionRoleData['data'][0]>(() => {
		return {
			name: '',
			guild_id: params.server,
			message_id: '',
			channel_id: '',
			emojies: []
		};
	});

	function setData(newData?: ReactionRoleData['data'][0]) {
		edit.value = !!newData;
		if (newData) {
			data.value = cloneDeep(newData);
		} else {
			data.value = cloneDeep(defaultData.value);
		}
	}

	const busy = ref(false);
	const edit = ref(false);
	const data = ref(cloneDeep(defaultData.value));

	const {
		data: roles,
		refresh: refreshRoles,
		pending: rolesPending
	} = await useFetch(`/api/server/${params.server}/roles`, {
		method: 'GET',
		query: searchParams
	});

	const { data: reactionRoles, refresh } = await useFetch(
		`/api/server/${params.server}/reaction-roles`,
		{
			method: 'GET',
			query: searchParams
		}
	);

	watch(
		() => {
			return data.value.channel_id;
		},
		() => {
			data.value.message_id = '';
		}
	);

	function selectEmoji(emoji: string) {
		data.value.emojies[setIndex.value].emoji = emoji;
		op.value.toggle();
	}

	const validToSave = computed(() => {
		return (
			!!data.value.name &&
			!!data.value.channel_id &&
			!!data.value.message_id &&
			data.value.emojies.length > 0 &&
			data.value.emojies.every((r) => {
				return !!r.emoji && r.role_ids.length > 0;
			})
		);
	});

	async function save() {
		if (!validToSave.value || busy.value) {
			return;
		}

		if (edit.value) {
			busy.value = true;
			const result = await $$fetch(
				`/api/server/${params.server}/reaction-roles/update/${data.value.message_id}`,
				{
					method: 'POST',
					body: data.value
				}
			).catch((e) => {
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: `Failed to update Reaction roles: ${e.message}`,
					life: 3000
				});
				return null;
			});
			busy.value = false;

			if (result) {
				toast.add({
					severity: 'success',
					summary: 'Success',
					detail: 'Reaction roles updated successfully',
					life: 3000
				});
				await refresh();
				setData();
			}
			return;
		}

		busy.value = true;
		const result = await $$fetch(`/api/server/${params.server}/reaction-roles`, {
			method: 'POST',
			body: data.value
		}).catch((e) => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed to save Reaction roles: ${e.message}`,
				life: 3000
			});
			return null;
		});
		busy.value = false;

		if (result) {
			toast.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Reaction roles saved successfully',
				life: 3000
			});
			await refresh();
			setData();
		}
	}

	function deleteItem(event: Event, item: ReactionRoleData['data'][0]) {
		confirm.require({
			message: 'Are you sure you want to proceed?',
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle text-xl me-2',
			rejectLabel: 'Cancel',
			rejectClass: 'p-button-text p-button-text',
			acceptClass: 'p-button-danger p-button-text',
			acceptLabel: 'Delete',
			accept: async () => {
				if (busy.value) {
					return;
				}

				busy.value = true;
				const result = await $$fetch(
					`/api/server/${params.server}/reaction-roles/update/${item.message_id}`,
					{
						method: 'DELETE'
					}
				).catch((e) => {
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: `Failed to delete item: ${e.message}`,
						life: 3000
					});
					return null;
				});
				busy.value = false;

				if (result) {
					toast.add({
						severity: 'success',
						summary: 'Success',
						detail: 'Item deleted successfully',
						life: 3000
					});
					await refresh();
				}
			}
		});
	}
</script>

<template>
	<div>
		<div class="md:px-2">
			<Panel :header="edit ? 'Edit' : 'Create'">
				<div class="flex flex-col gap-2 p-2">
					<InputText v-model="data.name" placeholder="Internal Name" class="w-full" />

					<CommonChannelSelection
						v-model="data.channel_id"
						no-edit
						:channel-types="ChannelTypes.text"
						:disabled="!!edit" />

					<CommonMessageSelection
						v-if="!!data.channel_id"
						v-model="data.message_id"
						:channel-id="data.channel_id"
						:disabled="!!edit" />

					<div class="flex items-center gap-2">
						<span class="flex-1">Emojies and Roles</span>

						<Button
							size="small"
							type="button"
							icon="pi pi-refresh"
							label="Refresh Roles"
							:loading="rolesPending"
							@click="refreshRoles()" />

						<Button
							size="small"
							:disabled="data.emojies.length >= 8"
							label="Add new Emoji"
							icon="pi pi-plus"
							@click="
								data.emojies.push({
									message_id: null,
									emoji: '',
									role_ids: []
								})
							" />
					</div>

					<div v-if="roles" class="grid grid-cols-1 gap-2 xl:grid-cols-2">
						<div
							v-for="(item, idx) of data.emojies"
							:key="item.emoji"
							class="flex w-full flex-col gap-2 rounded border bg-surface-50 p-2 dark:border-surface-800 dark:bg-surface-700">
							<div class="flex gap-2">
								<Button
									outlined
									:label="item.emoji || '??'"
									@click="toggleEmojiSelect($event, idx)" />
								<Button
									severity="danger"
									outlined
									label="Remove"
									icon="pi pi-trash"
									class="flex-1"
									@click="data.emojies.splice(idx, 1)" />
							</div>
							<MultiSelect
								v-model="item.role_ids"
								variant="filled"
								filter
								placeholder="Select at least one Role"
								:options="
									roles
										.filter((r) => !r.name.includes('@everyone'))
										.map((r) => r.id)
								"
								class="flex-1">
								<template #value="slotProps">
									<div
										class="align-items-center flex max-w-64 overflow-hidden truncate">
										<template v-if="!!slotProps.value.length">
											{{
												slotProps.value
													.map((id: string) => {
														return (
															roles!.find((r) => r.id === id)?.name ??
															id
														);
													})
													.join(', ')
											}}
										</template>
										<template v-else>
											{{ slotProps.placeholder }}
										</template>
									</div>
								</template>
								<template #option="slotProps">
									<div class="align-items-center flex">
										<div>
											{{
												roles.find((r) => r.id === slotProps.option)
													?.name ?? slotProps.option
											}}
										</div>
									</div>
								</template>
								<template #footer>
									<div class="px-3 py-2">
										<b>{{ item.role_ids.length }}</b>
										item{{ item.role_ids.length > 1 ? 's' : '' }}
										selected.
									</div>
								</template>
							</MultiSelect>
						</div>
					</div>

					<div class="flex gap-2">
						<Button
							v-if="edit"
							class="flex-1"
							:loading="busy"
							severity="danger"
							@click="setData()">
							Create a new Reaction Role
						</Button>
						<Button
							:disabled="!validToSave"
							class="flex-1"
							:loading="busy"
							@click="save">
							Save
						</Button>
					</div>
				</div>
			</Panel>
		</div>

		<Paginator
			v-model:rows="searchParams.limit"
			:total-records="reactionRoles?.total ?? 0"
			class="mt-2 rounded-lg"
			:rows-per-page-options="[10, 20, 30, 40, 50]"
			@update:first="searchParams.offset = searchParams.limit * $event">
			<template #start="slotProps">
				Showing {{ slotProps.state.first + 1 }} to
				{{
					Math.min(
						slotProps.state.first + 1 + searchParams.limit - 1,
						reactionRoles?.total ?? 0
					)
				}}
				of {{ reactionRoles?.total ?? 0 }}
			</template>
		</Paginator>

		<div class="my-2 grid grid-cols-1 gap-2 md:px-2 xl:grid-cols-2">
			<Card
				v-for="item of reactionRoles?.data ?? []"
				:key="item.message_id"
				:pt="{
					root: [
						//Shape
						'rounded-lg',
						'shadow-md',
						'cursor-pointer',

						//Color
						'hover:bg-primary-50 bg-surface-0 dark:bg-surface-900 hover:dark:bg-surface-700',
						'hover:dark:text-primary-500 hover:text-primary-700 text-surface-700 dark:text-surface-0/80'
					],
					body: '',
					content: 'p-4'
				}"
				class="w-full justify-end rounded-none md:rounded-lg"
				@click="setData(item)">
				<template #content>
					<div class="flex items-center gap-2">
						<span class="flex flex-1 items-center gap-3 text-xl font-semibold">
							<i class="pi pi-pen-to-square h-10 w-10 text-4xl" />
							<div class="flex flex-1 flex-col">
								<span>
									{{ item.name }}
								</span>
								<span class="whitespace-break-spaces text-xs">
									Message ID: {{ item.message_id }}
								</span>
							</div>
						</span>

						<Button
							severity="danger"
							:loading="busy"
							icon="pi pi-trash"
							label="Delete"
							@click.stop="deleteItem($event, item)" />
					</div>
				</template>
			</Card>
		</div>

		<OverlayPanel
			ref="op"
			append-to="body"
			:pt="{
				content: 'p-0 items-center flex'
			}">
			<EmojiPicker
				:key="String(darkMode.active.value)"
				:theme="darkMode.active.value ? 'dark' : 'light'"
				:native="true"
				@select="selectEmoji($event.i)" />
		</OverlayPanel>
	</div>
</template>

<style></style>
