import { type Kysely, sql } from "kysely";

const DATABASE_CONNECTION_CHECK_DELAY = 25;
const DATABASE_CONNECTION_CHECK_LIMIT = 120;

type DatabaseConnectionRow = {
	applicationName: string | null;
	count: string;
	state: string | null;
};

const delayFn = async () => {
	await new Promise((resolveFn) => {
		setTimeout(resolveFn, DATABASE_CONNECTION_CHECK_DELAY);
	});
};

export namespace waitForDatabaseConnectionsFn {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		name: string;
	}
}

export const waitForDatabaseConnectionsFn = async <TDatabase>({
	kysely,
	name,
}: waitForDatabaseConnectionsFn.Props<TDatabase>) => {
	let lastRows: DatabaseConnectionRow[] = [];

	for (let attempt = 0; attempt < DATABASE_CONNECTION_CHECK_LIMIT; attempt++) {
		const result = await sql<DatabaseConnectionRow>`
			SELECT
				application_name AS "applicationName",
				state,
				count(*)::text AS count
			FROM pg_stat_activity
			WHERE datname = ${name}
				AND pid <> pg_backend_pid()
			GROUP BY application_name, state
			ORDER BY application_name, state
		`.execute(kysely);

		lastRows = [
			...result.rows,
		];

		if (lastRows.length === 0) {
			return;
		}

		await delayFn();
	}

	throw new Error(
		[
			`Timed out waiting for database "${name}" connections to close.`,
			...lastRows.map((row) =>
				[
					"-",
					row.applicationName || "(no application_name)",
					row.state || "(no state)",
					row.count,
				].join(" "),
			),
		].join("\n"),
	);
};
