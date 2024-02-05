import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { capitalize, getUserName } from './module/utils.mjs';
import { startingDir, getRootDir, getParentDir } from './module/utils.mjs';

// HANDLERS
const getUpperPath = () => {
	if (currentPath !== getRootDir()) {
		currentPath = getParentDir(currentPath);
	}
};

let currentPath = startingDir();

const getPrompt = () => {
	return `\nYou are currently in ${currentPath} \n`;
};

// ERROR HANDLING
const showInputErrorMessage = (message = 'Invalid input') => {
	console.log(message);
};

const showExecutionErrorMessage = (message = 'Operation failed') => {
	console.log(message);
};

const handleOperation = (command) => {
	switch (command) {
		case 'up':
			getUpperPath();
			break;
		default:
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

	await rl.question(`Welcome to the File Manager, ${username}! `);

	rl.on('line', (input) => {
		if (input === '.exit') {
			rl.close();
		} else if (input.trim().length > 0) {
			handleOperation(input);

			rl.setPrompt(getPrompt());
			rl.prompt();
		}
	});

	rl.on('SIGINT', () => {
		rl.close();
	});

	rl.on('close', () => {
		console.log(`Thank you for using File Manager, ${username}, goodbye!!`);
	});
}

main();
