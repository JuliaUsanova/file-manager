import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output, cwd } from 'node:process';
import { InputHandler } from './input-handler.mjs';

export class FileManager {
	constructor(username) {
		this.handler = new InputHandler();
		this.username = username;
		this.rl = readline.createInterface({
			input,
			output
		});

		this.addListeners();
	}

	async start() {
		const userInput = await this.rl.question(
			`\nWelcome to the File Manager, ${this.username}! \n`
		);

		this.handleUserInput(userInput, this.rl);
	}

	addListeners() {
		this.rl.on('line', async (userInput) => {
			await this.handleUserInput(userInput, this.rl);
		});

		this.rl.on('SIGINT', () => {
			this.rl.close();
		});

		this.rl.on('close', () => {
			const message = `Thank you for using File Manager, ${this.username}, goodbye!!`;

			console.log(`\n\x1b[32m ${message}\x1b[0m \n`);
		});
	}

	async handleUserInput(userInput) {
		if (userInput === '.exit') {
			this.rl.close();
		} else if (userInput.trim().length > 0) {
			await this.handler.resolve(userInput);

			this.showPrompt();
		}
	}

	showPrompt() {
		const message = `\nYou are currently in ${cwd()} \n`;

		this.rl.setPrompt(message);
		this.rl.prompt();
	}
}
