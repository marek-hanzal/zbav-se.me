import { Effect } from "effect";
import { withCloseApiFx } from "./close";
import { withDisputeApiFx } from "./dispute";
import { withRejectApiFx } from "./reject";
import { withResolveApiFx } from "./resolve";
import { withSuccessApiFx } from "./success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withRejectApiFx(),
		withResolveApiFx(),
		withSuccessApiFx(),
		withDisputeApiFx(),
		withCloseApiFx(),
	]);
});
