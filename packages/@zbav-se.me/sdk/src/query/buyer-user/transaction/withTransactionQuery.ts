import { withCollectionQuery, withNoopMutation } from "@use-pico/client/query";
import { withTransactionCollectionQuery } from "./withTransactionCollectionQuery";
import { withTransactionCountQuery } from "./withTransactionCountQuery";
import { withTransactionFetchQuery } from "./withTransactionFetchQuery";

export const withTransactionQuery = withCollectionQuery({
	keys: (data) => [
		"transaction",
		"collection",
		data,
	],
	collectionQuery: withTransactionCollectionQuery,
	fetchQuery: withTransactionFetchQuery,
	countQuery: withTransactionCountQuery,
	patchMutation: withNoopMutation,
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
});
