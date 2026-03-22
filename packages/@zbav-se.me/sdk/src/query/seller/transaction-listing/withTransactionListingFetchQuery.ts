import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionListingFetch } from "../../../api/seller/sdk.gen";
import type {
	tApiTransactionListingFetchResponse,
	tTransactionListingQuery,
} from "../../../api/seller/types.gen";

export const withTransactionListingFetchQuery = withQuery<
	tTransactionListingQuery,
	tApiTransactionListingFetchResponse[200]
>({
	keys(data) {
		return [
			"transaction-listing",
			"fetch",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionListingFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
