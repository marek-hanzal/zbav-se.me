import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withTransactionMessageTextApiFx = Effect.fn("withTransactionMessageTextApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
