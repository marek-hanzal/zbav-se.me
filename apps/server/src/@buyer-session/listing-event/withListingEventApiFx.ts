import { Effect } from "effect";
import { withCreateApiFx } from "~/@buyer-session/listing-event/create";

export const withListingEventApiFx = Effect.fn("withListingEventApiFx")(function* () {
	yield* withCreateApiFx();
});
