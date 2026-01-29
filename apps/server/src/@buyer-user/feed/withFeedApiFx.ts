import { Effect } from "effect";
import { withCollectionApiFx } from "~/@buyer-user/feed/collection";
import { withCountApiFx } from "~/@buyer-user/feed/count";
import { withCreateApiFx } from "~/@buyer-user/feed/create";
import { withDeleteApiFx } from "~/@buyer-user/feed/delete";
import { withFetchApiFx } from "~/@buyer-user/feed/fetch";
import { withPatchApiFx } from "~/@buyer-user/feed/patch";

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
