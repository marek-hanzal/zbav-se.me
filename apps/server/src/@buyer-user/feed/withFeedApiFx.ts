import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withCreateApiFx } from "./create";
import { withDeleteApiFx } from "./delete";
import { withFetchApiFx } from "./fetch";
import { withPatchApiFx } from "./patch";

export const withFeedApiFx = Effect.fn("withFeedApiFx")(function* () {
	yield* Effect.all([
		withCreateApiFx(),
		withPatchApiFx(),
		withFetchApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withDeleteApiFx(),
	]);
});
