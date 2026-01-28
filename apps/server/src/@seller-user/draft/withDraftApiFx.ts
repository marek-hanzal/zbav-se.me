import { Effect } from "effect";
import { withCollectionApiFx } from "~/@seller-user/draft/collection";
import { withCountApiFx } from "~/@seller-user/draft/count";
import { withCreateApiFx } from "~/@seller-user/draft/create";
import { withDeleteApiFx } from "~/@seller-user/draft/delete";
import { withFetchApiFx } from "~/@seller-user/draft/fetch";
import { withPatchApiFx } from "~/@seller-user/draft/patch";

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
