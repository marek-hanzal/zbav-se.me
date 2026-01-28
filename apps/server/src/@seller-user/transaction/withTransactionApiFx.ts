import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
	]);
});
