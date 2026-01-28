import { Effect } from "effect";
import { withMigrationRunApiFx } from "~/@public/migration/run";

export const withMigrationApiFx = Effect.fn("withMigrationApiFx")(function* () {
	yield* withMigrationRunApiFx();
});
