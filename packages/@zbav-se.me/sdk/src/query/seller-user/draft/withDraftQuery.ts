import { withCollectionQuery } from "@use-pico/client/query";
import { withDraftPatchMutation } from "../../../mutation/seller-user/draft";
import { withDraftCollectionQuery } from "./withDraftCollectionQuery";
import { withDraftCountQuery } from "./withDraftCountQuery";
import { withDraftFetchQuery } from "./withDraftFetchQuery";

export const withDraftQuery = withCollectionQuery({
	keys: (data) => [
		"draft",
		"collection",
		data,
	],
	collectionQuery: withDraftCollectionQuery,
	fetchQuery: withDraftFetchQuery,
	countQuery: withDraftCountQuery,
	patchMutation: withDraftPatchMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
