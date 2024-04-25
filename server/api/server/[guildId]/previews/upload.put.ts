import { readFiles } from 'h3-formidable';

export default defineEventHandler(async (event) => {
	const { fields, files } = await readFiles(event);

	if (!Array.isArray(files.files) || files.files.length === 0) {
		throw createError('No files uploaded');
	}

	console.log({ fields, file: files.files.at(0) });

	return {
		success: true
	};
});
