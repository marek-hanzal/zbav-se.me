import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/transaction-message-location/create";

export const withTransactionMessageLocationApiFx = Effect.fn("withTransactionMessageLocationApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
