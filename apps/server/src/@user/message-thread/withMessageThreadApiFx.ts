import { Effect } from "effect";
import { withMessageCollectionApiFx } from "~/@user/message-thread/message/collection";
import { withMessageCountApiFx } from "~/@user/message-thread/message/count";
import { withMessageFetchApiFx } from "~/@user/message-thread/message/fetch";

export const withMessageThreadApiFx = Effect.fn("withMessageThreadApiFx")(function* () {
	yield* Effect.all([
		withMessageCollectionApiFx(),
		withMessageFetchApiFx(),
		withMessageCountApiFx(),
	]);
});
