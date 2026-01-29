import { Effect } from "effect";
import { withSellerInfoApiFx } from "~/@seller-session/listing/seller-info";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* withSellerInfoApiFx();
});
