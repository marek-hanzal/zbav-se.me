import { Effect } from "effect";
import { seedTestLocationsFx } from "~/test/common/fx/seedTestLocationsFx";
import { seedTestUsersFx } from "~/test/common/fx/seedTestUsersFx";
import { testDatabaseFx } from "~/test/common/fx/testDatabaseFx";
import { withTestabaseFx } from "~/test-database/fx/withTestabaseFx";

export async function setupDatabaseFn() {
	return withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-e2e-postgres",
		template: "e2e",
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
}
