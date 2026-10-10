import { Effect } from "effect";
import { databaseFx } from "~/database/fx/databaseFx";
import { DialectStore } from "~/database/service/DialectStore";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";

export const runMigrationFn = async () => {
	const { SERVER_DATABASE_URL: dsn } = ServerDatabaseSchema.parse(process.env);
	const dialect = DialectStore.createPoolFn({
		dsn,
		pool: {
			max: 1,
			connectionTimeoutMillis: 30_000,
		},
		onErrorFn(error) {
			console.error("PostgreSQL connection error.", error.message);
			process.exitCode = 1;
		},
	});

	try {
		const database = await databaseFx.pipe(withDialectFn(dialect), Effect.runPromise);
		await database.migrateFn();
	} finally {
		await DialectStore.closeFn(dsn);
	}
};
