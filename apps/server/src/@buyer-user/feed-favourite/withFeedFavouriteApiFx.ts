import { Effect } from "effect";
import { withFeedFavouriteCollectionApiFx } from "./collection";

export const withFeedFavouriteApiFx = Effect.fn("withFeedFavouriteApiFx")(function* () {
	yield* withFeedFavouriteCollectionApiFx();
});
