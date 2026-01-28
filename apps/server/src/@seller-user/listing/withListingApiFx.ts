import { Effect } from "effect";
import { withCreateApiFx } from "~/@seller-user/listing/create";

export const withListingApiFx = Effect.fn("withListingApiFx")(function* () {
	yield* withCreateApiFx();
});
