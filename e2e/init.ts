import { Effect } from "effect";
import { withTestabaseFx } from "@/lib/server/test";
import { databaseFx } from "~/server/database/databaseFx";
import { seedTestLocationsFx } from "~/test/common/fx/seedTestLocationsFx";
import { seedTestUsersFx } from "~/test/common/fx/seedTestUsersFx";

export default async function globalSetup() {
	return withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-e2e-postgres",
		port: 55432,
		template: "e2e",
		databaseFx,
		onMigrate: (database) => {
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
