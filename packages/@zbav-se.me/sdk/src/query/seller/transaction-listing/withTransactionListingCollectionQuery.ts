import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionListingCollection } from "../../../api/seller/sdk.gen";
import type {
	tApiTransactionListingCollectionResponse,
	tTransactionListingQuery,
} from "../../../api/seller/types.gen";

export const withTransactionListingCollectionQuery = withQuery<
	tTransactionListingQuery,
	tApiTransactionListingCollectionResponse[200]
>({
	keys(variables) {
		return [
			"transaction-listing",
			"collection",
			variables,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionListingCollection({
					body,
					headers,
				}),
			);
		},
	}),
});
