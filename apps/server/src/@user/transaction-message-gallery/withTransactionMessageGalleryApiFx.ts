import { Effect } from "effect";
import { withCreateApiFx } from "~/@user/transaction-message-gallery/create";

export const withTransactionMessageGalleryApiFx = Effect.fn("withTransactionMessageGalleryApiFx")(
	function* () {
		yield* withCreateApiFx();
	},
);
