import { Effect } from "effect";
import { withAcceptApiFx } from "./accept";
import { withCloseApiFx } from "./close";
import { withDisputeApiFx } from "./dispute";
import { withRejectApiFx } from "./reject";
import { withResolveApiFx } from "./resolve";
import { withSuccessApiFx } from "./success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withAcceptApiFx(),
		withRejectApiFx(),
		withResolveApiFx(),
		withSuccessApiFx(),
		withDisputeApiFx(),
		withCloseApiFx(),
	]);
});
