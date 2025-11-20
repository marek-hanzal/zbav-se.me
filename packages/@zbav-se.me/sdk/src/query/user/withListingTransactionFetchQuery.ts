import { withQuery } from "@use-pico/client/query";
import { apiListingTransactionFetch } from "../../api/user/sdk.gen";
import type {
	tApiListingTransactionFetchResponse,
	tListingTransactionQuery,
} from "../../api/user/types.gen";

export const withListingTransactionFetchQuery = withQuery<
	tListingTransactionQuery,
	tApiListingTransactionFetchResponse[200]
>({
	keys(variables) {
		return [
			"listing-transaction",
			"fetch",
			variables,
		];
	},
	async queryFn(body) {
		return apiListingTransactionFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
