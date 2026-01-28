import { Effect } from "effect";
import { withAcceptApiFx } from "./accept";
import { withResolveApiFx } from "./resolve";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withResolveApiFx(),
	]);
});
