import { Effect } from "effect";
import { withAcceptApiFx } from "~/@seller/transaction/accept";
import { withBuyerInfoApiFx } from "~/@seller/transaction/buyer-info";
import { withCollectionApiFx } from "~/@seller/transaction/collection";
import { withCountApiFx } from "~/@seller/transaction/count";
import { withDisputeApiFx } from "~/@seller/transaction/dispute";
import { withFetchApiFx } from "~/@seller/transaction/fetch";
import { withRejectApiFx } from "~/@seller/transaction/reject";
import { withResolveApiFx } from "~/@seller/transaction/resolve";

export const withTransactionApiFx = Effect.fn("withTransactionApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withBuyerInfoApiFx(),
		withCollectionApiFx(),
		withCountApiFx(),
		withDisputeApiFx(),
		withFetchApiFx(),
		withRejectApiFx(),
		withResolveApiFx(),
	]);
});
