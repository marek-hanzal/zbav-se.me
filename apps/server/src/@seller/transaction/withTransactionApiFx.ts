import { Effect } from "effect";
import { withBuyerInfoApiFx } from "~/@seller/transaction/buyer-info";
import { withCollectionApiFx } from "~/@seller/transaction/collection";
import { withCountApiFx } from "~/@seller/transaction/count";
import { withFetchApiFx } from "~/@seller/transaction/fetch";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withBuyerInfoApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withFetchApiFx(),
	]);
});
