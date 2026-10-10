import { Effect } from "effect";
import type { TestProject } from "vitest/node";
import { seedTestLocationsFx } from "~/test/common/fx/seedTestLocationsFx";
import { seedTestUsersFx } from "~/test/common/fx/seedTestUsersFx";
import { testDatabaseFx } from "~/test/common/fx/testDatabaseFx";
import { withTestabaseFx } from "~/test-database/fx/withTestabaseFx";

export default async function globalSetupFn(project: TestProject) {
	const testDatabase = await withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-test-postgres",
		template: "test",
		databaseFx: testDatabaseFx,
		onMigrateFn: (database) => {
			return Effect.gen(function* () {
				yield* seedTestLocationsFx({
					database,
				});
				yield* seedTestUsersFx({
					database,
				});
			}).pipe(Effect.runPromise);
		},
	}).pipe(Effect.runPromise);

	project.provide("testDatabaseDsn", testDatabase.dsn);
	return testDatabase.cleanupFn;
}
