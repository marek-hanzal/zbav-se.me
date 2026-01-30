import { Effect } from "effect";
import { withItemsApiFx } from "~/@arkini/board/items";
import { withSaveApiFx } from "~/@arkini/board/save";

export const withBoardApiFx = Effect.fn("withBoardApiFx")(function* () {
	yield* withItemsApiFx();
	yield* withSaveApiFx();
});
