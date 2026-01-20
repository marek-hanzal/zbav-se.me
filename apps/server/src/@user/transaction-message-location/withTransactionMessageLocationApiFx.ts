import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withTransactionMessageLocationApiFx = Effect.fn("withTransactionMessageLocationApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
