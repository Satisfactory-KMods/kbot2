import fs from 'fs';
import fsp from 'fs/promises';
import { join } from 'path';
export const FileAdapter = new (class FileAdapter {
	move(from: string, to: string) {
		if (!fs.existsSync(from)) {
			throw new Error('File not found');
		}

		if (!fs.existsSync(to)) {
			const toPath = to.split('/');
			toPath.pop();
			fs.mkdirSync(toPath.join('/'), { recursive: true });
		}
		return fsp.rename(from, to);
	}

	createReadStream(filePath: string) {
		if (!fs.existsSync(filePath)) {
			throw new Error('File not found');
		}

		return fs.createReadStream(filePath);
	}

	async remove(filePath: string) {
		if (fs.existsSync(filePath)) {
			if (fs.lstatSync(filePath).isDirectory()) {
				await this.removeDirRecurs(filePath);
			} else {
				await fsp.unlink(filePath);
			}
		}
	}

	/**
	 * @internal
	 */
	private async removeDirRecurs(filePath: string) {
		if (fs.existsSync(filePath)) {
			const dirs = await fsp.readdir(filePath, { withFileTypes: true });
			for (const file of dirs) {
				const curPath = join(filePath, file.name);
				if (file.isDirectory()) {
					await this.removeDirRecurs(curPath);
				} else {
					await fsp.unlink(curPath);
				}
			}
			await fsp.rmdir(filePath);
		}
	}
})();
