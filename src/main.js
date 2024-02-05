import { chdir } from 'node:process';
import { capitalize, getUserName } from './module/utils.mjs';
import { startingDir } from './module/utils.mjs';
import { FileManager } from './module/file-manager.mjs';

// MAIN
async function main() {
	const username = capitalize(getUserName());

	chdir(startingDir());

	const fileManager = new FileManager(username);

	fileManager.start();
}

main();
