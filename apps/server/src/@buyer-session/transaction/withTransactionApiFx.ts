import { Effect } from "effect";
import { withBuyerInfoApiFx } from "./buyer-info";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* withBuyerInfoApiFx();
});
