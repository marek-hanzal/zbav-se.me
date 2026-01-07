import { Effect } from "effect";
import { withMigrationRunApiFx } from "./migration-run";

export const withMigrationApiFx = Effect.fn("withMigrationApiFx")(function* () {
	yield* withMigrationRunApiFx();
});
