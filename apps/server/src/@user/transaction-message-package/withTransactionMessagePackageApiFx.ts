import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/transaction-message-package/create";

export const withTransactionMessagePackageApiFx = Effect.fn("withTransactionMessagePackageApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
