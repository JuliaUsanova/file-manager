import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output, cwd, chdir } from 'node:process';
import { capitalize, getUserName } from './module/utils.mjs';
import {
	startingDir,
	getRootDir,
	getParentDir,
	getNormalPath
} from './module/utils.mjs';

// HANDLERS
const getUpperPath = () => {
	const currentPath = cwd();
	if (currentPath !== getRootDir()) {
		try {
			chdir(getParentDir(currentPath));
		} catch (_) {
			showExecutionErrorMessage();
		}
	}
};

const goToPath = (inputPath) => {
	try {
		chdir(getNormalPath(inputPath));
	} catch (_) {
		showExecutionErrorMessage();
	}
};

const getPrompt = () => {
	return `\nYou are currently in ${cwd()} \n`;
};

// ERROR HANDLING
const showInputErrorMessage = (message = '\nInvalid input') => {
	console.log(`\x1b[33m ${message}\x1b[0m`);
};

const showExecutionErrorMessage = (message = '\nOperation failed') => {
	console.log(`\x1b[31m ${message}\x1b[0m`);
};

const handleOperation = (command) => {
	if (command === 'up') {
		getUpperPath();
	} else if (command.startsWith('cd ')) {
		goToPath(command.slice(3));
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
		console.log(
			`\nThank you for using File Manager, ${username}, goodbye!!\n`
		);
	});
}

main();
