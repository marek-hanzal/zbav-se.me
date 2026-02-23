import { withCollectionQuery } from "@use-pico/client/query";
import { withFeedPatchMutation } from "../../../mutation/buyer-user/feed";
import { withFeedCollectionQuery } from "./withFeedCollectionQuery";
import { withFeedCountQuery } from "./withFeedCountQuery";
import { withFeedFetchQuery } from "./withFeedFetchQuery";

export const withFeedQuery = withCollectionQuery({
	key: (data) => [
		"feed",
		data,
	],
	collectionQuery: withFeedCollectionQuery,
	fetchQuery: withFeedFetchQuery,
	countQuery: withFeedCountQuery,
	patchMutation: withFeedPatchMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
