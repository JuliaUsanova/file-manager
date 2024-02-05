export const InputErrorMessage = `\nInvalid input`;

export const ExecutionErrorMessage = `\nOperation failed`;

export const showInputErrorMessage = (message = InputErrorMessage) => {
	console.log(`\x1b[33m ${message}\x1b[0m`);
};

export const showExecutionErrorMessage = (message = ExecutionErrorMessage) => {
	console.log(`\x1b[31m ${message}\x1b[0m`);
};
