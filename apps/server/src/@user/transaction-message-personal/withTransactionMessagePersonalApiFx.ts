import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withTransactionMessagePersonalApiFx = Effect.fn("withTransactionMessagePersonalApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
