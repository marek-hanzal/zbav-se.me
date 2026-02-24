import { withCollectionQuery, withNoopMutation } from "@use-pico/client/query";
import { withFeedFavouriteCollectionQuery } from "./withFeedFavouriteCollectionQuery";
import { withFeedFavouriteCountQuery } from "./withFeedFavouriteCountQuery";
import { withFeedFavouriteFetchQuery } from "./withFeedFavouriteFetchQuery";

export const withFeedFavouriteQuery = withCollectionQuery({
	keys: (data) => [
		"feed-favourite",
		"collection",
		data,
	],
	collectionQuery: withFeedFavouriteCollectionQuery,
	fetchQuery: withFeedFavouriteFetchQuery,
	countQuery: withFeedFavouriteCountQuery,
	patchMutation: withNoopMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
