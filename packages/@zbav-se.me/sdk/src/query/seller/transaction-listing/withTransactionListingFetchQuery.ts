import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiTransactionListingFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
