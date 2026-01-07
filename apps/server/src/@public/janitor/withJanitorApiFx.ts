import { Effect } from "effect";
import { withJanitorCleanupApiFx } from "./janitor-cleanup";

export const withJanitorApiFx = Effect.fn("withJanitorApiFx")(function* () {
	yield* withJanitorCleanupApiFx();
});
