import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer/feed/collection";
import { withCountApiFx } from "~/@buyer/feed/count";
import { withCreateApiFx } from "~/@buyer/feed/create";
import { withDeleteApiFx } from "~/@buyer/feed/delete";
import { withFetchApiFx } from "~/@buyer/feed/fetch";
import { withPatchApiFx } from "~/@buyer/feed/patch";

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
