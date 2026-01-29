import { Effect } from "effect";
import { withHistoryApiFx } from "~/@public/github/history";

export const withGithubApiFx = Effect.fn("withGithubApiFx")(function* () {
	yield* withHistoryApiFx();
});
