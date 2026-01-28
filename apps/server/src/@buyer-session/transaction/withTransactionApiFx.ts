import { Effect } from "effect";
import { withBuyerInfoApiFx } from "~/@buyer-session/transaction/buyer-info";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* withBuyerInfoApiFx();
});
