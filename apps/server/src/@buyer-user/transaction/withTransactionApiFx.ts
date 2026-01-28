import { Effect } from "effect";
import { withCollectionApiFx } from "./collection";
import { withCreateApiFx } from "./create";
import { withFetchApiFx } from "./fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withCollectionApiFx(),
		withCreateApiFx(),
		withFetchApiFx(),
	]);
});
