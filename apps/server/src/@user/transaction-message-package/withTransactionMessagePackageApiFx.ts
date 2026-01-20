import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withTransactionMessagePackageApiFx = Effect.fn("withTransactionMessagePackageApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
