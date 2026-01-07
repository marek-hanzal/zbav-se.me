import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withFeedbackApiFx = Effect.fn("withFeedbackApiFx")(function* () {
	yield* withCreateApiFx();
});
