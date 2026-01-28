import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/transaction-message-text/create";

export const withTransactionMessageTextApiFx = Effect.fn("withTransactionMessageTextApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
