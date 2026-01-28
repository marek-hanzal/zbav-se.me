import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/transaction-message-personal/create";

export const withTransactionMessagePersonalApiFx = Effect.fn("withTransactionMessagePersonalApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
