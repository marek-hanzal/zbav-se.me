import { Effect } from "effect";
import { withFeedFavouriteCollectionApiFx } from "~/@buyer-user/feed-favourite/collection";

export const withFeedFavouriteApiFx = Effect.fn("withFeedFavouriteApiFx")(function* () {
	yield* withFeedFavouriteCollectionApiFx();
});
