import { withCollectionQuery } from "@use-pico/client/query";
import { withFeedPatchMutation } from "../../../mutation/buyer-user/feed";
import { withFeedCollectionQuery } from "./withFeedCollectionQuery";
import { withFeedFetchQuery } from "./withFeedFetchQuery";

export const withFeedQuery = withCollectionQuery({
	key: (data) => [
		"feed",
		data,
	],
	collectionQuery: withFeedCollectionQuery,
	fetchQuery: withFeedFetchQuery,
	patchMutation: withFeedPatchMutation,
	toFetchKey: (item) => ({
		where: {
			id: item.id,
		},
	}),
});
