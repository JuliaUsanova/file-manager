import { argv } from 'node:process';

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getUserName = () => {
	const args = argv.slice(2);

	if (args.length > 0) {
		const argIndex = args.findIndex((arg) => arg.startsWith('--username='));

		return argIndex > -1 ? args[argIndex].split('=')[1] : 'ANONIMOUS';
	}
	return 'ANONIMOUS';
};
