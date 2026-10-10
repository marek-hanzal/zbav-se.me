import { Effect } from "effect";
import { inject, onTestFinished } from "vitest";
import type { Database } from "~/database/type/Database";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { testabaseFn as coolTestabaseFn } from "~/test-database/fn/testabaseFn";

declare module "vitest" {
	export interface ProvidedContext {
		testDatabaseDsn: string;
	}
}

export const testabaseFn = (name: string) => {
	const dsn = inject("testDatabaseDsn");
	if (!dsn) {
		throw new Error(
			"Database tests require the integration project. Remove the .unit suffix from this test file.",
		);
	}

	return coolTestabaseFn({
		dsn,
		databaseFx: withDatabaseFx<Database>({
			logger: getRootLoggerFn([
				"db",
			]),
		}).pipe(Effect.provideService(MigrationContextFx, {})),
		name,
		onTestFinishedFn: onTestFinished,
	});
};
