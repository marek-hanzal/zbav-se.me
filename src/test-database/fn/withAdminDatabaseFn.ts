import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { DialectContextFx } from "~/database-query/service/DialectContextFx";

export namespace withAdminDatabaseFn {
	export interface Props<TDatabase> {
		databaseFx: Effect.Effect<withDatabaseFx.Instance<TDatabase>, never, DialectContextFx>;
		dsn: string;
		name: string;
		root: string;
	}
}

export const withAdminDatabaseFn = async <TDatabase>({
	databaseFx,
	dsn,
	name,
	root,
}: withAdminDatabaseFn.Props<TDatabase>) => {
	return databaseFx.pipe(
		withDialectFn(
			new PostgresDialect({
				pool: new Pool({
					connectionString: withDatabaseNameFn({
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
