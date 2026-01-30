import { Effect } from "effect";
import { withItemsApiFx } from "~/@arkini/board/items";

export const withBoardApiFx = Effect.fn("withBoardApiFx")(function* () {
	yield* withItemsApiFx();
});
