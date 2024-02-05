import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output, cwd, argv } from 'node:process';
import { capitalize, getUserName } from './module/utils.mjs';

const handleReply = (reply) => {
	console.log(`Received: ${reply}`);
};

// MAIN
function main() {
	const rl = readline.createInterface({
		input,
		output
	});
	const username = capitalize(getUserName());

	rl.question(`Welcome to the File Manager, ${username}! `);

	rl.on('line', (input) => {
		if (input === '.exit') {
			rl.close();
		} else if (input.trim().length > 0) {
			handleReply(input);

			rl.setPrompt(`You are currently in ${cwd()}`);
			rl.prompt();
		}
	});

	rl.on('close', () => {
		console.log(`Thank you for using File Manager, ${username}, goodbye!!`);
	});
}

main();
