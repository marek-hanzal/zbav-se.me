import { Effect } from "effect";
import { withCreateApiFx } from "~/@buyer/listing-event/create";

export const withListingEventApiFx = Effect.fn("withListingEventApiFx")(function* () {
	yield* withCreateApiFx();
});
