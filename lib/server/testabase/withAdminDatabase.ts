import { Effect } from "effect";
import { PostgresDialect } from "kysely";
import { Pool } from "pg";
import {
	type DialectContextFx,
	type withDatabaseFx,
	withDatabaseName,
	withDialectFx,
} from "@/lib/common/database";

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
