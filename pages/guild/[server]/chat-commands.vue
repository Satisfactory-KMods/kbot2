<script lang="ts" setup>
	import type { ChatCommandData } from '~/server/api/server/[guildId]/chat-commands.get';
	import cloneDeep from 'lodash/cloneDeep';
	import { useSearchParams } from '../../../composables/useParams';

	const confirm = useConfirm();
	const toast = useToast();
	const { params } = useParams({
		values: {
			server: String()
		}
	});

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

	const { data: chatCommands, refresh } = await useFetch(
		`/api/server/${params.server}/chat-commands`,
		{
			method: 'GET',
			query: searchParams
		}
	);

	const { data: config } = await useFetch(`/api/server/${params.server}/config/general`, {
		method: 'GET'
	});

	const defaultData = computed<ChatCommandData['data'][0]>(() => {
		return {
			command_id: '',
			triggers: [],
			reaction_text: '',
			enable_auto_matching: false,
			guild_id: params.server
		};
	});

	const busy = ref(false);
	const edit = ref(false);
	const data = ref(cloneDeep(defaultData.value));

	function setData(editData?: ChatCommandData['data'][0]) {
		if (editData) {
			edit.value = true;
			data.value = cloneDeep(editData);
			return;
		}
		edit.value = false;
		data.value = cloneDeep(defaultData.value);
	}

	const rules = computed({
		get: () => {
			return data.value.triggers.filter((trigger) => {
				return trigger.type !== 'prefix';
			});
		},
		set: (value) => {
			data.value.triggers = [
				...data.value.triggers.filter((trigger) => {
					return trigger.type === 'prefix';
				}),
				...value
			];
		}
	});

	const commands = computed({
		get: () => {
			return data.value.triggers.filter((trigger) => {
				return trigger.type === 'prefix';
			});
		},
		set: (value) => {
			data.value.triggers = [
				...data.value.triggers.filter((trigger) => {
					return trigger.type !== 'prefix';
				}),
				...value
			];
		}
	});

	const autoMatchingId = useId();
	const reactionTextId = useId();

	const validToSave = computed(() => {
		return (
			commands.value.length > 0 &&
			commands.value.every((item) => {
				switch (item.type) {
					case 'prefix':
						return item.trigger.trim().length > 0;
					case 'fuzzy':
						return (
							item.trigger.trim().length > 0 &&
							item.match_percentage > 0 &&
							item.match_percentage <= 1
						);
					case 'regex':
						try {
							// eslint-disable-next-line no-new
							new RegExp(item.trigger.trim());
						} catch (e) {
							return false;
						}
				}
				return item.trigger.trim().length > 0;
			}) &&
			!!data.value.reaction_text.trim()
		);
	});

	const settingsValidToSave = computed(() => {
		if (!config.value) {
			return false;
		}
		return config.value.base.chat_command_prefix.trim().length === 1;
	});

	async function save() {
		if (!validToSave.value || busy.value) {
			return;
		}

		if (edit.value) {
			busy.value = true;
			const result = await $$fetch(
				`/api/server/${params.server}/chat-commands/update/${data.value.command_id}`,
				{
					method: 'POST',
					body: data.value
				}
			).catch((e) => {
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: `Failed to update settings: ${e.message}`,
					life: 3000
				});
				return null;
			});
			busy.value = false;

			if (result) {
				toast.add({
					severity: 'success',
					summary: 'Success',
					detail: 'Command updated successfully',
					life: 3000
				});
				await refresh();
				setData();
			}
			return;
		}

		busy.value = true;
		const result = await $$fetch(`/api/server/${params.server}/chat-commands`, {
			method: 'POST',
			body: data.value
		}).catch((e) => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed to save settings: ${e.message}`,
				life: 3000
			});
			return null;
		});
		busy.value = false;

		if (result) {
			toast.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Command saved successfully',
				life: 3000
			});
			await refresh();
			setData();
		}
	}

	async function saveSettings() {
		if (!settingsValidToSave.value || busy.value || !config.value) {
			return;
		}

		busy.value = true;
		const result = await $$fetch(`/api/server/${params.server}/config/general`, {
			method: 'POST',
			body: {
				chat_command_prefix: config.value.base.chat_command_prefix
			}
		}).catch((e: any) => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed to save settings: ${e.message}`,
				life: 3000
			});
			return null;
		});
		busy.value = false;

		if (result) {
			toast.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Settings saved successfully',
				life: 3000
			});
			await refresh();
		}
	}

	function deleteItem(event: Event, item: ChatCommandData['data'][0]) {
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
					`/api/server/${params.server}/chat-commands/update/${item.command_id}`,
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
				<TabView>
					<TabPanel header="Generel Config">
						<div class="flex flex-col gap-2">
							<div class="flex flex-col gap-1">
								<label :for="reactionTextId">Command Text</label>
								<Textarea
									:id="reactionTextId"
									v-model="data.reaction_text"
									class="w-full" />
							</div>

							<div class="flex items-center gap-2">
								<InputSwitch
									v-model="data.enable_auto_matching"
									:input-id="autoMatchingId" />
								<label :for="autoMatchingId">Enable auto matching</label>
							</div>

							<div class="flex flex-col gap-1">
								<div class="flex items-center gap-2">
									<span class="flex-1">Commands triggers</span>
									<Button
										:disabled="commands.length >= 8"
										icon="pi pi-plus"
										@click="
											data.triggers.push({
												type: 'prefix',
												trigger: '',
												command_id: '',
												match_percentage: 0.75
											})
										" />
								</div>
								<div class="mt-2 grid gap-2 xl:grid-cols-2">
									<div
										v-for="item of commands"
										:key="item.command_id"
										class="flex gap-1 rounded border bg-surface-50 p-2">
										<InputText
											v-model="item.trigger"
											placeholder="Command Trigger (ABC)"
											class="w-full" />
										<Button
											size="small"
											severity="danger"
											icon="pi pi-times"
											@click="
												data.triggers.splice(data.triggers.indexOf(item), 1)
											" />
									</div>
								</div>
							</div>
							<div class="flex gap-2">
								<Button
									v-if="edit"
									severity="danger"
									class="flex-1"
									:loading="busy"
									:disabled="!validToSave"
									@click="setData()">
									Create a new command
								</Button>
								<Button
									class="flex-1"
									:loading="busy"
									:disabled="!validToSave"
									@click="save()">
									Save
								</Button>
							</div>
						</div>
					</TabPanel>

					<TabPanel :disabled="!data.enable_auto_matching" header="Auto matching rule">
						<div class="flex flex-col gap-2">
							<Message severity="info">
								<p class="p-2">
									Auto matching rules are used to match the message instead using
									the command prefix.
									<br />
									For Fuzzy search will be use the middle of all weights. For
									example:
									<br />
									if you have 3 rules with 0.5, 0.6, 0.7 the middle will be 0.6.
								</p>

								<p class="p-2">
									You can find
									<a href="https://regexr.com/" target="_blank"
										>Some more informations about RegExp</a
									>
								</p>
							</Message>

							<div class="flex items-center gap-2">
								<span class="flex-1">Matching Rules</span>
								<Button
									:disabled="rules.length >= 8"
									label="Fuzzy Rule"
									icon="pi pi-plus"
									@click="
										data.triggers.push({
											type: 'fuzzy',
											trigger: '',
											command_id: '',
											match_percentage: 0.75
										})
									" />
								<Button
									:disabled="rules.length >= 8"
									label="Regex Rule"
									icon="pi pi-plus"
									@click="
										data.triggers.push({
											type: 'regex',
											trigger: '//g',
											command_id: '',
											match_percentage: 0.75
										})
									" />
							</div>
							<div class="mt-2 flex flex-col gap-1">
								<div
									v-for="item of rules"
									:key="item.command_id"
									class="flex gap-1 rounded border bg-surface-50 p-2 dark:border-surface-800 dark:bg-surface-700">
									<InputText
										v-model="item.trigger"
										placeholder="Trigger text"
										class="w-full" />
									<InputNumber
										v-if="item.type === 'fuzzy'"
										v-model="item.match_percentage"
										:max="1"
										:min="0.05"
										:max-fraction-digits="5" />
									<Button
										size="small"
										severity="danger"
										icon="pi pi-times"
										@click="
											data.triggers.splice(data.triggers.indexOf(item), 1)
										" />
								</div>
							</div>
							<div class="flex gap-2">
								<Button
									v-if="edit"
									class="flex-1"
									:loading="busy"
									severity="danger"
									:disabled="!validToSave"
									@click="setData()">
									Create a new command
								</Button>
								<Button
									class="flex-1"
									:loading="busy"
									:disabled="!validToSave"
									@click="save()">
									Save
								</Button>
							</div>
						</div>
					</TabPanel>

					<TabPanel v-if="config" header="Generel Command Config (global)">
						<div class="flex flex-col gap-2">
							<div class="flex flex-col gap-1">
								<span class="flex-1">Command Prefix</span>
								<InputText
									v-model="config.base.chat_command_prefix"
									placeholder="Trigger text"
									class="w-full" />
							</div>
							<Button
								:loading="busy"
								:disabled="!settingsValidToSave"
								@click="saveSettings()"
								>Save</Button
							>
						</div>
					</TabPanel>
				</TabView>
			</Panel>
		</div>

		<Paginator
			v-model:rows="searchParams.limit"
			:total-records="chatCommands?.total ?? 0"
			class="mt-2 rounded-lg"
			:rows-per-page-options="[10, 20, 30, 40, 50]"
			@update:first="searchParams.offset = searchParams.limit * $event">
			<template #start="slotProps">
				Showing {{ slotProps.state.first + 1 }} to
				{{
					Math.min(
						slotProps.state.first + 1 + searchParams.limit - 1,
						chatCommands?.total ?? 0
					)
				}}
				of {{ chatCommands?.total ?? 0 }}
			</template>
		</Paginator>

		<div class="my-2 grid grid-cols-1 gap-2 md:px-2 xl:grid-cols-2">
			<Card
				v-for="item of chatCommands?.data ?? []"
				:key="item.command_id"
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
								<span class="whitespace-break-spaces text-xs">
									{{ item.reaction_text }}
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
	</div>
</template>

<style lang="postcss"></style>
