import type { Effect } from "effect";
import { sql } from "kysely";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { waitForDatabaseConnectionsFn } from "~/test-database/fn/waitForDatabaseConnectionsFn";
import { withAdminDatabaseFn } from "~/test-database/fn/withAdminDatabaseFn";

export namespace dropDatabaseFn {
	export interface Props<TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		dsn: string;
		name: string;
		root: string;
	}
}

export const dropDatabaseFn = async <TDatabase>({
	databaseFx,
	dsn,
	name,
	root,
}: dropDatabaseFn.Props<TDatabase>) => {
	const { kysely } = await withAdminDatabaseFn({
		databaseFx,
		dsn,
		name: `drop:${name}`,
		root,
	});

	try {
		await waitForDatabaseConnectionsFn({
			kysely,
			name,
		});
		await sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely);
	} finally {
		await kysely.destroy();
	}
};
