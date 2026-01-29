import { Effect } from "effect";
import { withJanitorCleanupApiFx } from "~/@public/janitor/janitor-cleanup";

export const withJanitorApiFx = Effect.fn("withJanitorApiFx")(function* () {
	yield* withJanitorCleanupApiFx();
});
