import { Effect } from "effect";
import { withMigrationRunApiFx } from "./run";

export const withMigrationApiFx = Effect.fn("withMigrationApiFx")(function* () {
	yield* withMigrationRunApiFx();
});
