import { withCollectionQuery, withNoopMutation } from "@use-pico/client/query";
import { withTransactionListingCollectionQuery } from "./withTransactionListingCollectionQuery";
import { withTransactionListingCountQuery } from "./withTransactionListingCountQuery";
import { withTransactionListingFetchQuery } from "./withTransactionListingFetchQuery";

export const withTransactionListingQuery = withCollectionQuery({
	keys: (data) => [
		"transaction-listing",
		"collection",
		data,
	],
	collectionQuery: withTransactionListingCollectionQuery,
	fetchQuery: withTransactionListingFetchQuery,
	countQuery: withTransactionListingCountQuery,
	patchMutation: withNoopMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
