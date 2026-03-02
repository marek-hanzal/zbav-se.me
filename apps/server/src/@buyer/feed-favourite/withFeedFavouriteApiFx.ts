import { Effect } from "effect";
import { withFeedFavouriteCollectionApiFx } from "~/@buyer/feed-favourite/collection";
import { withCountApiFx } from "~/@buyer/feed-favourite/count";
import { withFetchApiFx } from "~/@buyer/feed-favourite/fetch";

export const withFeedFavouriteApiFx = Effect.fn("withFeedFavouriteApiFx")(function* () {
	yield* Effect.all([
		withFeedFavouriteCollectionApiFx(),
		withFetchApiFx(),
		withCountApiFx(),
	]);
});
