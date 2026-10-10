import { type Kysely, sql } from "kysely";

const DATABASE_CONNECTION_CHECK_DELAY = 25;
const DATABASE_CONNECTION_CHECK_LIMIT = 120;

type DatabaseConnectionRow = {
	applicationName: string | null;
	count: string;
	state: string | null;
};

const delay = async () => {
	await new Promise((resolve) => {
		setTimeout(resolve, DATABASE_CONNECTION_CHECK_DELAY);
	});
};

export namespace waitForDatabaseConnections {
	export interface Props<TDatabase> {
		kysely: Kysely<TDatabase>;
		name: string;
	}
}

export const waitForDatabaseConnections = async <TDatabase>({
	kysely,
	name,
}: waitForDatabaseConnections.Props<TDatabase>) => {
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

		await delay();
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
