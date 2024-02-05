import { argv, cwd, chdir } from 'node:process';
import { homedir } from 'node:os';
import path from 'node:path';

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getUserName = () => {
	const args = argv.slice(2);

	if (args.length > 0) {
		const argIndex = args.findIndex((arg) => arg.startsWith('--username='));

		return argIndex > -1 ? args[argIndex].split('=')[1] : 'ANONIMOUS';
	}
	return 'ANONIMOUS';
};

export const startingDir = () => homedir();

export const getRootDir = () => path.parse(cwd()).root;

export const getParentDir = (currentPath) => path.dirname(currentPath);

export const getNormalPath = (inputPath) => {
	if (path.isAbsolute(inputPath.trim())) {
		return path.normalize(inputPath.trim());
	}
	return path.resolve(cwd(), path.normalize(inputPath.trim()));
};

export const goToPath = (inputPath) => {
	chdir(getNormalPath(inputPath));
};

export const getUpperPath = () => {
	const currentPath = cwd();
	if (currentPath !== getRootDir()) {
		chdir(getParentDir(currentPath));
	}
};
