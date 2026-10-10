import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withDatabaseName } from "~/database-query/fn/withDatabaseName";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { withDialectFx } from "~/database-query/fx/withDialectFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";

export namespace withAdminDatabase {
	export interface Props<TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		dsn: string;
		name: string;
		root: string;
	}
}

export const withAdminDatabase = async <TDatabase>({
	databaseFx,
	dsn,
	name,
	root,
}: withAdminDatabase.Props<TDatabase>) => {
	return databaseFx.pipe(
		withDialectFx(
			new PostgresDialect({
				pool: new Pool({
					connectionString: withDatabaseName({
						dsn,
						name: root,
					}),
					application_name: `testabase:admin:${name}`,
					max: 1,
				}),
			}),
		),
		Effect.runPromise,
	);
};
