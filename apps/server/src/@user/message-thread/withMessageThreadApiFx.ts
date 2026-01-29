import { Effect } from "effect";
import { withMessageCollectionApiFx } from "~/@user/message-thread/message/collection";

export const withMessageThreadApiFx = Effect.fn("withMessageThreadApiFx")(function* () {
	yield* withMessageCollectionApiFx();
});
