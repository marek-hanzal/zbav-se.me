import type { Effect } from "effect";
import { sql } from "kysely";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";
import { waitForDatabaseConnections } from "~/test-database/fn/waitForDatabaseConnections";
import { withAdminDatabase } from "~/test-database/fn/withAdminDatabase";

export namespace dropDatabase {
	export interface Props<TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		dsn: string;
		name: string;
		root: string;
	}
}

export const dropDatabase = async <TDatabase>({
	databaseFx,
	dsn,
	name,
	root,
}: dropDatabase.Props<TDatabase>) => {
	const { kysely } = await withAdminDatabase({
		databaseFx,
		dsn,
		name: `drop:${name}`,
		root,
	});

	try {
		await waitForDatabaseConnections({
			kysely,
			name,
		});
		await sql`DROP DATABASE IF EXISTS ${sql.ref(name)}`.execute(kysely);
	} finally {
		await kysely.destroy();
	}
};
