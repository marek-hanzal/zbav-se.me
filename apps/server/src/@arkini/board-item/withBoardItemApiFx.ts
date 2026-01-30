import { Effect } from "effect";
import { withCollectionApiFx } from "~/@arkini/board-item/collection";
import { withPatchApiFx } from "~/@arkini/board-item/patch";

export const withBoardItemApiFx = Effect.fn("withBoardItemApiFx")(function* () {
	yield* withCollectionApiFx();
	yield* withPatchApiFx();
});
