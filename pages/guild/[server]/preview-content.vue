<script lang="ts" setup>
	import axios from 'axios';
	import moment from 'moment-timezone';
	import { useFormatSize } from '~/composables/useFormatSize';

	const params = useParams({
		values: {
			server: String()
		}
	});

	const formatSize = useFormatSize();

	const searchParams = useSearchParams({
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

	const confirm = useConfirm();
	const loading = ref(false);
	const toast = useToast();
	const progress = ref(0);
	const filesRef = ref([] as File[]);
	const uploadForm = reactive({
		mod_reference: '',
		version: '',
		changelog: '',
		patreon: true
	});

	watch(
		() => {
			return uploadForm.patreon;
		},
		() => {
			searchParams.offset = 0;
		}
	);

	const query = computed(() => {
		return searchParams;
	});

	const { data: existings, refresh: refreshExistings } = await useFetch(
		`/api/server/${params.server}/previews/existings`,
		{
			method: 'GET',
			query
		}
	);

	const { data: config, refresh } = await useFetch(
		`/api/server/${params.server}/config/general`,
		{
			method: 'GET'
		}
	);

	async function uploader() {
		if (loading.value) {
			return;
		}
		const formData = new FormData();
		for (const file of filesRef.value) {
			formData.append('files', file);
		}

		for (const [key, value] of Object.entries(uploadForm)) {
			formData.append(key, String(value));
		}

		loading.value = true;
		progress.value = 0;
		const result = await axios
			.put(`/api/server/${params.server}/previews/upload`, formData, {
				onUploadProgress: (progressEvent) => {
					progress.value = Math.round(
						(progressEvent.loaded / (progressEvent.total ?? 1000)) * 100
					);
				}
			})
			.catch((error) => {
				toast.add({
					severity: 'error',
					summary: 'Error',
					detail: error.response.data.message
				});
			});
		loading.value = false;

		if (result) {
			resetForm();

			progress.value = 100;
		}
		await refreshExistings().catch(() => {});
	}

	function resetForm() {
		filesRef.value = [];
		uploadForm.mod_reference = '';
		uploadForm.version = '';
		uploadForm.changelog = '';
		uploadForm.patreon = true;
	}

	const validToUpload = computed(() => {
		return (
			!!uploadForm.mod_reference &&
			!!uploadForm.version &&
			!!uploadForm.changelog &&
			filesRef.value.length > 0
		);
	});

	async function saveSettings() {
		if (loading.value) {
			return;
		}
		if (!config.value) return;
		loading.value = true;
		const result = await $$fetch(`/api/server/${params.server}/config/general`, {
			method: 'POST',
			body: config.value.base
		}).catch((e: any) => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed to save settings: ${e.message}`,
				life: 3000
			});
			return null;
		});
		loading.value = false;

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

	async function togglePatreon(item: string, patreon: boolean) {
		if (loading.value) {
			return;
		}

		loading.value = true;
		const result = await $$fetch(`/api/server/${params.server}/previews/update/${item}`, {
			method: 'POST',
			body: {
				patreon
			}
		}).catch(() => {
			toast.add({
				severity: 'error',
				summary: 'Error',
				detail: `Failed saved item: ${item}`,
				life: 3000
			});
			return null;
		});
		await refreshExistings().catch(() => {});
		loading.value = false;

		if (result) {
			toast.add({
				severity: 'success',
				summary: 'Success',
				detail: 'Item saved successfully',
				life: 3000
			});
			await refreshExistings().catch(() => {});
		}
	}

	function deleteItem(item: string) {
		if (loading.value) {
			return;
		}
		confirm.require({
			message: 'Are you sure you want to proceed?',
			header: 'Confirmation',
			icon: 'pi pi-exclamation-triangle text-xl me-2',
			rejectLabel: 'Cancel',
			rejectClass: 'p-button-text p-button-text',
			acceptClass: 'p-button-danger p-button-text',
			acceptLabel: 'Delete',
			accept: async () => {
				if (loading.value) {
					return;
				}

				loading.value = true;
				const result = await $$fetch(
					`/api/server/${params.server}/previews/update/${item}`,
					{
						method: 'DELETE'
					}
				).catch(() => {
					toast.add({
						severity: 'error',
						summary: 'Error',
						detail: `Failed to delete item: ${item}`,
						life: 3000
					});
					return null;
				});
				loading.value = false;

				if (result) {
					toast.add({
						severity: 'success',
						summary: 'Success',
						detail: 'Item deleted successfully',
						life: 3000
					});
					await refreshExistings().catch(() => {});
				}
			}
		});
	}
</script>

<template>
	<div>
		<div class="md:px-2">
			<Panel v-if="config" header="Manage Mod Announcements">
				<TabView>
					<TabPanel header="Generel Config">
						<div class="flex flex-col gap-2">
							<h3 class="text-xl font-semibold">Patreon Config</h3>
							<label>Ping Roles</label>
							<CommonRoleSelection
								v-model="config.base.patreon_ping_roles"
								:disabled="loading"
								:no-edit="true" />

							<label>Announcement Channel</label>
							<CommonChannelSelection
								v-model="config.base.patreon_announcement_channel_id"
								:channel-types="[ChannelTypes.text]"
								:disabled="loading"
								:no-edit="true" />

							<label>Changelog Forum</label>
							<CommonChannelSelection
								v-model="config.base.patreon_changelog_forum"
								:channel-types="[ChannelTypes.forum]"
								:disabled="loading"
								:no-edit="true" />

							<label>Release Text</label>
							<Textarea
								v-model="config.base.patreon_release_text"
								class="min-h-64 w-full" />

							<Divider />
							<h3 class="text-xl font-semibold">Public Config</h3>
							<label>Ping Roles</label>
							<CommonRoleSelection
								v-model="config.base.public_ping_roles"
								:disabled="loading"
								:no-edit="true" />

							<label>Announcement Channel</label>
							<CommonChannelSelection
								v-model="config.base.public_announcement_channel_id"
								:channel-types="[ChannelTypes.text]"
								:disabled="loading"
								:no-edit="true" />

							<label>Changelog Forum</label>
							<CommonChannelSelection
								v-model="config.base.public_changelog_forum"
								:channel-types="[ChannelTypes.forum]"
								:disabled="loading"
								:no-edit="true" />

							<label>Release Text</label>
							<Textarea
								v-model="config.base.public_release_text"
								class="min-h-64 w-full" />
							<Button :loading="loading" @click="saveSettings()">Save</Button>
						</div>
					</TabPanel>
					<TabPanel header="Upload Release">
						<form class="flex flex-col gap-2" @submit.prevent="uploader">
							<label>Mod</label>
							<CommonModRefSelection
								v-model="uploadForm.mod_reference"
								class="w-full" />

							<label>Version</label>
							<InputText v-model="uploadForm.version" required class="w-full" />

							<label>Changelog</label>
							<Textarea
								v-model="uploadForm.changelog"
								required
								class="min-h-64 w-full" />
							<FileUpload
								:show-cancel-button="false"
								:show-upload-button="false"
								mode="advanced"
								:loading="loading"
								accept="application/x-zip-compressed"
								:multiple="true"
								:custom-upload="true"
								@select="filesRef = $event.files"
								@remove="filesRef = $event.files"
								@uploader="uploader">
								<template #content="{ files, removeFileCallback }">
									<div v-if="filesRef.length > 0">
										<div class="grid grid-cols-1 gap-5 p-0 lg:grid-cols-2">
											<div
												v-for="(file, index) of files"
												:key="file.name + file.type + file.size"
												class="card flex-column border-1 surface-border align-items-center m-0 flex items-center gap-3 rounded border p-4 px-6">
												<div class="flex flex-col gap-1">
													<span class="font-semibold">{{
														file.name
													}}</span>
													<div class="flex gap-2">
														<Badge value="Pending" severity="warning" />
														<div class="flex-1">
															{{ formatSize(file.size) }}
														</div>
													</div>
												</div>
												<div class="flex-1" />
												<div>
													<Button
														icon="pi pi-times"
														outlined
														rounded
														severity="danger"
														@click="removeFileCallback(index)" />
												</div>
											</div>
										</div>
									</div>
								</template>
								<template #empty>
									<div
										class="justify-content-center flex flex-col items-center border-none">
										<i
											class="pi pi-cloud-upload text-400 border-400 p-5 text-8xl" />
										<p class="mb-0 mt-4">
											Drag and drop files to here to upload.
										</p>
									</div>
								</template>
							</FileUpload>

							<ProgressBar v-if="loading" :value="progress" />
							<div class="flex gap-2">
								<ToggleButton
									v-model="uploadForm.patreon"
									class="flex-1"
									on-label="Patreon"
									off-label="Non-Patreon"
									on-icon="pi pi-check"
									off-icon="pi pi-times" />
								<Button
									:disabled="!validToUpload"
									class="flex-1"
									:loading="loading"
									@click="uploader()"
									>Upload</Button
								>
							</div>
						</form>
					</TabPanel>
				</TabView>
			</Panel>
		</div>

		<!-- existing -->
		<Paginator
			v-model:rows="searchParams.limit"
			:total-records="existings?.total ?? 0"
			class="mt-2 rounded-lg"
			:rows-per-page-options="[10, 20, 30, 40, 50]"
			@update:first="searchParams.offset = searchParams.limit * $event">
			<template #start="slotProps">
				Showing {{ slotProps.state.first + 1 }} to
				{{
					Math.min(
						slotProps.state.first + 1 + searchParams.limit - 1,
						existings?.total ?? 0
					)
				}}
				of {{ existings?.total ?? 0 }}
			</template>
		</Paginator>

		<div class="my-2 grid grid-cols-1 gap-2 md:px-2 xl:grid-cols-2">
			<Card
				v-for="item of existings?.downloads ?? []"
				:key="item.id"
				:pt="{
					body: '',
					content: 'p-4'
				}"
				class="w-full justify-end rounded-none md:rounded-lg">
				<template #content>
					<div class="flex items-center gap-2">
						<span class="flex flex-1 items-center gap-3 text-xl font-semibold">
							<i class="pi pi-pen-to-square h-10 w-10 text-4xl" />
							<div class="flex flex-1 flex-col">
								<span> {{ item.mod.name }} - v.{{ item.version }} </span>
								<span class="text-xs">
									{{ moment(item.mod.updated_at).format('YYYY/MM/DD HH:mm') }}
								</span>
							</div>
						</span>

						<ToggleButton
							:disabled="loading"
							:model-value="item.patreon"
							on-label="Patreon"
							off-label="Non-Patreon"
							on-icon="pi pi-check"
							off-icon="pi pi-times"
							@click="togglePatreon(item.id, !item.patreon)" />

						<Button
							severity="danger"
							:loading="loading"
							icon="pi pi-trash"
							label="Delete"
							@click.stop="deleteItem(item.id)" />
					</div>
					<div class="mt-2 flex flex-col gap-2">
						<div
							v-for="file of item.files"
							:key="file.id"
							class="flex items-center gap-3 rounded border bg-slate-100 p-2 dark:border-surface-700 dark:bg-surface-800">
							<i class="pi pi-file h-10 w-10 text-4xl" />
							<div class="flex flex-1 flex-col">
								<span class="whitespace-break-spaces text-xs">
									{{ file.name }} - ({{ formatSize(file.size) }})
								</span>
							</div>
							<NuxtLink
								target="_blank"
								:to="`/api/preview/guild/${params.server}/download/${file.download_id}/${file.id}`">
								<Button icon="pi pi-download" label="Download" />
							</NuxtLink>
						</div>
					</div>
				</template>
			</Card>
		</div>
	</div>
</template>

<style></style>
