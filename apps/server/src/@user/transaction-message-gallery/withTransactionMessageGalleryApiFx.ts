import { Effect } from "effect";
import { withCreateApiFx } from "./create";

export const withTransactionMessageGalleryApiFx = Effect.fn("withTransactionMessageGalleryApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
