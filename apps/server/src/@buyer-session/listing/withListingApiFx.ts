import { Effect } from "effect";
import { withSellerInfoApiFx } from "~/@buyer-session/listing/seller-info";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* withSellerInfoApiFx();
});
