import { Effect } from "effect";
import { withHistoryApiFx } from "./history";

export const withGithubApiFx = Effect.fn("withGithubApiFx")(function* () {
	yield* withHistoryApiFx();
});
