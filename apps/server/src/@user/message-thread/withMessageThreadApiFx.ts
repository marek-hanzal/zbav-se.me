import { Effect } from "effect";
import { withMessageCollectionApiFx } from "./message/collection";

export const withMessageThreadApiFx = Effect.fn("withMessageThreadApiFx")(function* () {
	yield* withMessageCollectionApiFx();
});
