import { Effect } from "effect";
import { withArchiveApiFx } from "~/@user/inbox/archive";
import { withCollectionApiFx } from "~/@user/inbox/collection";
import { withCountApiFx } from "~/@user/inbox/count";
import { withFetchApiFx } from "~/@user/inbox/fetch";
import { withPatchApiFx } from "~/@user/inbox/patch";
import { withPatchCollectionApiFx } from "~/@user/inbox/patch-collection";

export const withInboxApiFx = Effect.fn("withInboxApiFx")(function* () {
	yield* Effect.all([
		withArchiveApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
		withPatchApiFx(),
		withPatchCollectionApiFx(),
	]);
});
