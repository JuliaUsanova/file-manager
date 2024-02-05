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

	rl.write(`Welcome to the File Manager, ${capitalize(getUserName())}! `);

	rl.on('line', (input) => {
		handleReply(input);

		rl.setPrompt(`You are currently in ${cwd()}`);
		rl.prompt();
	});
}

main();
