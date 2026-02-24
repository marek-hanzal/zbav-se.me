import { Effect } from "effect";
import { withFeedFavouriteCollectionApiFx } from "~/@buyer-user/feed-favourite/collection";
import { withCountApiFx } from "~/@buyer-user/feed-favourite/count";
import { withFetchApiFx } from "~/@buyer-user/feed-favourite/fetch";

export const withFeedFavouriteApiFx = Effect.fn("withFeedFavouriteApiFx")(function* () {
	yield* Effect.all([
		withFeedFavouriteCollectionApiFx(),
		withFetchApiFx(),
		withCountApiFx(),
	]);
});
