import { Effect } from "effect";
import { withAcceptApiFx } from "./accept";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* withAcceptApiFx();
});
