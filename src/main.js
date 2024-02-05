import * as readline from 'node:readline/promises';
import { readdir, open, rename } from 'node:fs/promises';
import { stdin as input, stdout as output, cwd, chdir } from 'node:process';
import { capitalize, getUserName } from './module/utils.mjs';
import {
	startingDir,
	goToPath,
	getUpperPath,
	getNormalPath
} from './module/utils.mjs';
import { createReadStream } from 'node:fs';

// HANDLERS

const listContent = async (currentPath) => {
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
};

const getPrompt = () => {
	return `\nYou are currently in ${cwd()} \n`;
};

const catFileContent = (fileName) => {
	const inputPath = getNormalPath(fileName);
	createReadStream(inputPath)
		.on('error', () => {
			showExecutionErrorMessage();
		})
		.pipe(output);
};

const renameFile = async (oldFilePath, newFilePath) => {
	const inputPath = getNormalPath(oldFilePath);
	const newPath = getNormalPath(newFilePath);

	await rename(inputPath, newPath);
};

const addNewFile = async (fileName) => {
	const inputPath = getNormalPath(command.slice(4));
	await open(inputPath, 'wx');
};

const executeOperation = async (operation) => {
	try {
		await operation();
	} catch {
		showExecutionErrorMessage();
	}
};

// ERROR HANDLING
const showInputErrorMessage = (message = '\nInvalid input') => {
	console.log(`\x1b[33m ${message}\x1b[0m`);
};

const showExecutionErrorMessage = (message = '\nOperation failed') => {
	console.log(`\x1b[31m ${message}\x1b[0m`);
};

const handleOperation = async (command) => {
	if (command === 'up') {
		executeOperation(getUpperPath);
	} else if (command.startsWith('cd ')) {
		const argValue = command.slice(3);
		if (argValue.trim().length === 0) {
			showInputErrorMessage();
			return false;
		}
		executeOperation(() => goToPath(argValue));
	} else if (command === 'ls') {
		executeOperation(() => listContent(cwd()));
	} else if (command.startsWith('cat ')) {
		const argValue = command.slice(4);
		if (argValue.trim().length === 0) {
			showInputErrorMessage();
			return false;
		}
		catFileContent(argValue);
	} else if (command.startsWith('add ')) {
		const argValue = command.slice(4);
		if (argValue.trim().length === 0) {
			showInputErrorMessage();
			return false;
		}
		executeOperation(() => addNewFile(argValue));
	} else if (command.startsWith('rn ')) {
		const argValue = command.slice(3);
		if (argValue.trim().length === 0) {
			showInputErrorMessage();
			return false;
		}
		executeOperation(() => renameFile(...command.slice(3).split(' ')));
	} else {
		showInputErrorMessage();
	}
};

// MAIN
async function main() {
	const rl = readline.createInterface({
		input,
		output
	});

	const username = capitalize(getUserName());

	chdir(startingDir());

	const userInput = await rl.question(
		`\nWelcome to the File Manager, ${username}! \n`
	);

	if (userInput === '.exit') {
		rl.close();
	} else if (userInput.trim().length > 0) {
		handleOperation(userInput);

		rl.setPrompt(getPrompt());
		rl.prompt();
	}

	rl.on('line', (userInput) => {
		if (userInput === '.exit') {
			rl.close();
		} else if (userInput.trim().length > 0) {
			handleOperation(userInput);

			rl.setPrompt(getPrompt());
			rl.prompt();
		}
	});

	rl.on('SIGINT', () => {
		rl.close();
	});

	rl.on('close', () => {
		const message = `Thank you for using File Manager, ${username}, goodbye!!`;

		console.log(`\n\x1b[32m ${message}\x1b[0m \n`);
	});
}

main();
