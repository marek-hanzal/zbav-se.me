import { Effect } from "effect";
import { withCloseApiFx } from "./close";
import { withSuccessApiFx } from "./success";

export const withTransactionStatusApiFx = Effect.fn("withTransactionStatusApiFx")(function* () {
	yield* Effect.all([
		withCloseApiFx(),
		withSuccessApiFx(),
	]);
});
