import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCountApiFx } from "./count";
import { withCreateApiFx } from "./create";
import { withDeleteApiFx } from "./delete";
import { withFetchApiFx } from "./fetch";
import { withPatchApiFx } from "./patch";

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
