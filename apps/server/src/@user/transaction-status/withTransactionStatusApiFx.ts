import { Effect } from "effect";
import { withDisputeApiFx } from "./dispute";
import { withRejectApiFx } from "./reject";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withRejectApiFx(),
		withDisputeApiFx(),
	]);
});
