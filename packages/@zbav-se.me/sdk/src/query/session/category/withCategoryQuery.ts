import { withCollectionQuery, withNoopMutation } from "@use-pico/client/query";
import { withCategoryCollectionQuery } from "./withCategoryCollectionQuery";
import { withCategoryCountQuery } from "./withCategoryCountQuery";
import { withCategoryFetchQuery } from "./withCategoryFetchQuery";

export const withCategoryQuery = withCollectionQuery({
	keys: (data) => [
		"category",
		"collection",
		data,
	],
	collectionQuery: withCategoryCollectionQuery,
	fetchQuery: withCategoryFetchQuery,
	countQuery: withCategoryCountQuery,
	patchMutation: withNoopMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
