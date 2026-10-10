import { Effect } from "effect";
import { onTestFinished } from "vitest";
import type { Database } from "~/database/type/Database";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { ServerDatabaseSchema } from "~/server-env/schema/ServerDatabaseSchema";
import { testabaseFn as coolTestabaseFn } from "~/test-database/fn/testabaseFn";

export const testabaseFn = (name: string) => {
	return coolTestabaseFn({
		dsn: ServerDatabaseSchema.parse(process.env).SERVER_DATABASE_URL,
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLoggerFn([
				"db",
			]),
		}).pipe(Effect.provideService(MigrationContextFx, {})),
		name,
		onTestFinishedFn: onTestFinished,
	});
};
