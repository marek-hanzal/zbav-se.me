import { withCollectionQuery, withNoopMutation } from "@use-pico/client/query";
import { withListingCollectionQuery } from "./withListingCollectionQuery";
import { withListingCountQuery } from "./withListingCountQuery";
import { withListingFetchQuery } from "./withListingFetchQuery";

export const withListingQuery = withCollectionQuery({
	key: (data) => [
		"listing",
		"collection",
		data,
	],
	collectionQuery: withListingCollectionQuery,
	fetchQuery: withListingFetchQuery,
	countQuery: withListingCountQuery,
	patchMutation: withNoopMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
