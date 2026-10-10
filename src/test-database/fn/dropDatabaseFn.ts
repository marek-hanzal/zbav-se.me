import { type Kysely, sql } from "kysely";
import { waitForDatabaseConnectionsFn } from "~/test-database/fn/waitForDatabaseConnectionsFn";

export namespace dropDatabaseFn {
	export interface Props {
		kysely: Kysely<unknown>;
		name: string;
	}
}

export const dropDatabaseFn = async ({ kysely, name }: dropDatabaseFn.Props) => {
	try {
		await waitForDatabaseConnectionsFn({
			kysely,
			name,
		});
	} catch (error) {
		// Remove only this test's owned database, while still failing on leaked connections.
		try {
			await sql`DROP DATABASE IF EXISTS ${sql.id(name)} WITH (FORCE)`.execute(kysely);
		} catch (dropError) {
			throw new AggregateError(
				[
					error,
					dropError,
				],
				`Cannot clean up test database "${name}"`,
			);
		}
		throw error;
	}
	await sql`DROP DATABASE IF EXISTS ${sql.id(name)}`.execute(kysely);
};
