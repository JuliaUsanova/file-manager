export const showInputErrorMessage = (message = '\nInvalid input') => {
	console.log(`\x1b[33m ${message}\x1b[0m`);
};

export const showExecutionErrorMessage = (message = '\nOperation failed') => {
	console.log(`\x1b[31m ${message}\x1b[0m`);
};
