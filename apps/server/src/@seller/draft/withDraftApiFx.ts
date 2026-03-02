import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller/draft/collection";
import { withCountApiFx } from "~/@seller/draft/count";
import { withCreateApiFx } from "~/@seller/draft/create";
import { withDeleteApiFx } from "~/@seller/draft/delete";
import { withFetchApiFx } from "~/@seller/draft/fetch";
import { withPatchApiFx } from "~/@seller/draft/patch";

export const withDraftApiFx = Effect.fn("withDraftApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCountApiFx(),
		withCreateApiFx(),
		withDeleteApiFx(),
		withFetchApiFx(),
		withPatchApiFx(),
	]);
});
