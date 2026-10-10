export namespace cleanupDatabaseFn {
	export interface Props {
		databaseName: string;
		closePoolFn: () => Promise<void>;
		cleanupFn: () => Promise<void>;
	}
}

export async function cleanupDatabaseFn({
	databaseName,
	closePoolFn,
	cleanupFn,
}: cleanupDatabaseFn.Props) {
	const errors: unknown[] = [];

	try {
		await closePoolFn();
	} catch (error) {
		errors.push(error);
	}

	try {
		await cleanupFn();
	} catch (error) {
		errors.push(error);
	}

	if (errors.length > 0) {
		throw new AggregateError(errors, `Failed to clean up E2E database ${databaseName}`);
	}
}
