import { createReadStream, createWriteStream } from 'node:fs';
import { readdir, open, rename, rm } from 'node:fs/promises';
import { finished } from 'node:stream/promises';
import { getUpperPath, getNormalPath, goToPath } from './utils.mjs';
import {
	showExecutionErrorMessage,
	InputErrorMessage,
	ExecutionErrorMessage
} from './error-handlers.mjs';
import { stdout as output, cwd } from 'node:process';

export class InputHandler {
	async resolve(command) {
		if (command === 'up') {
			this.executeOperation(getUpperPath);
		} else if (command.startsWith('cd ')) {
			const param = command.slice(3);
			this.validateParams(param);

			this.executeOperation(() => goToPath(param));
		} else if (command === 'ls') {
			this.executeOperation(() => this.listContent(cwd()));
		} else if (command.startsWith('cat ')) {
			const param = command.slice(4);
			this.validateParams(param);

			this.catFileContent(param);
		} else if (command.startsWith('add ')) {
			const param = command.slice(4);
			this.validateParams(param);

			this.executeOperation(async () => await this.addNewFile(param));
		} else if (command.startsWith('rn ')) {
			const param = command.slice(3);
			this.validateParams(param);

			this.executeOperation(() => this.renameFile(...param.split(' ')));
		} else if (command.startsWith('cp ')) {
			const param = command.slice(3);
			this.validateParams(param);

			this.executeOperation(() => this.copyFile(...param.split(' ')));
		} else if (command.startsWith('mv ')) {
			const param = command.slice(3);
			this.validateParams(param);

			this.executeOperation(async () => await this.moveFile(...param.split(' ')));
		} else {
			throw new Error(InputErrorMessage);
		}
	}

	async executeOperation(operation) {
		try {
			await operation();
		} catch {
			throw new Error(ExecutionErrorMessage);
		}
	}

	validateParams(params) {
		if (params.trim().length === 0) {
			throw new Error(ExecutionErrorMessage);
		}
	}

	async addNewFile(filePath) {
		const inputPath = getNormalPath(filePath);

		await open(inputPath, 'wx');
	}

	async listContent(currentPath) {
		const result = await readdir(currentPath, { withFileTypes: true });

		const sortedResult = result
			.sort((a, b) => {
				if (a.isDirectory() && !b.isDirectory()) {
					return -1;
				} else if (!a.isDirectory() && b.isDirectory()) {
					return 1;
				} else {
					return a.name.localeCompare(b.name);
				}
			})
			.map((item) => ({
				Name: item.name,
				Type: item.isDirectory() ? 'directory' : 'file'
			}));

		console.table(sortedResult);
	}

	catFileContent(fileName) {
		const inputPath = getNormalPath(fileName);
		createReadStream(inputPath)
			.on('error', () => {
				showExecutionErrorMessage();
			})
			.pipe(output);
	}

	async renameFile(oldFilePath, newFilePath) {
		const inputPath = getNormalPath(oldFilePath);
		const newPath = getNormalPath(newFilePath);

		await rename(inputPath, newPath);
	}

	copyFile(sourceFilePath, targetFilePath) {
		const inputPath = getNormalPath(sourceFilePath);
		const targetPath = getNormalPath(targetFilePath);

		const srcStream = createReadStream(inputPath);
		const destStream = createWriteStream(targetPath);

		srcStream.pipe(destStream);
	}

	async moveFile(sourceFilePath, targetFilePath) {
		const inputPath = getNormalPath(sourceFilePath);
		const targetPath = getNormalPath(targetFilePath);

		const srcStream = createReadStream(inputPath);
		const destStream = createWriteStream(targetPath);

		srcStream.pipe(destStream);

		await finished(srcStream);

		await rm(inputPath);
	}
}
