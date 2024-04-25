<script lang="ts" setup>
	import axios from 'axios';
	const params = useParams({
		values: {
			server: String()
		}
	});

	const primevue = usePrimeVue();

	const progress = ref(0);
	const filesRef = ref([] as File[]);

	function formatSize(bytes: number) {
		const k = 1024;
		const dm = 3;
		const sizes = primevue.config.locale!.fileSizeTypes;

		if (bytes === 0) {
			return `0 ${sizes[0]}`;
		}

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

		return `${formattedSize} ${sizes[i]}`;
	}

	async function uploader() {
		const formData = new FormData();
		for (const file of filesRef.value) {
			formData.append('files', file);
		}

		progress.value = 0;
		const result = await axios.put(`/api/server/${params.server}/previews/upload`, formData, {
			onUploadProgress: (progressEvent) => {
				progress.value = Math.round(
					(progressEvent.loaded / (progressEvent.total ?? 1000)) * 100
				);
			}
		});

		progress.value = 100;
	}
</script>

<template>
	<div>
		<div class="md:px-2">
			<ProgressBar :value="progress" />
			<Panel header="Manage Mod Announcements">
				<FileUpload
					:show-cancel-button="false"
					:show-upload-button="false"
					mode="advanced"
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
										<span class="font-semibold">{{ file.name }}</span>
										<div class="flex gap-2">
											<Badge value="Pending" severity="warning" />
											<div class="flex-1">{{ formatSize(file.size) }}</div>
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
						<div class="justify-content-center flex flex-col items-center border-none">
							<i class="pi pi-cloud-upload text-400 border-400 p-5 text-8xl" />
							<p class="mb-0 mt-4">Drag and drop files to here to upload.</p>
						</div>
					</template>
				</FileUpload>
				<Button @click="uploader()" />
			</Panel>
		</div>
	</div>
</template>

<style></style>
