import { Effect } from "effect";
import { withMessageCollectionApiFx } from "~/@user/message/collection";
import { withMessageCountApiFx } from "~/@user/message/count";
import { withMessageCreateApiFx } from "~/@user/message/create";
import { withMessageFetchApiFx } from "~/@user/message/fetch";

export const withMessageApiFx = Effect.fn("withMessageApiFx")(function* () {
	yield* Effect.all([
		withMessageCollectionApiFx(),
		withMessageCountApiFx(),
		withMessageCreateApiFx(),
		withMessageFetchApiFx(),
	]);
});
