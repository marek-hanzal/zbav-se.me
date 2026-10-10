import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";

export namespace withAdminDatabaseFn {
	export interface Props {
		dsn: string;
		name: string;
		root: string;
	}
}

export const withAdminDatabaseFn = ({ dsn, name, root }: withAdminDatabaseFn.Props) => {
	return new Kysely<unknown>({
		dialect: new PostgresDialect({
			pool: new Pool({
				connectionString: withDatabaseNameFn({
					dsn,
					name: root,
				}),
				application_name: `testabase:admin:${name}`,
				max: 1,
				connectionTimeoutMillis: 5_000,
			}),
		}),
	});
};
