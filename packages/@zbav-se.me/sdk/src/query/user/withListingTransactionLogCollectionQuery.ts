import { withQuery } from "@use-pico/client/query";
import { apiListingTransactionLogCollection } from "../../api/user/sdk.gen";
import type {
	tApiListingTransactionLogCollectionResponse,
	tListingTransactionLogQuery,
} from "../../api/user/types.gen";

export const withListingTransactionLogCollectionQuery = withQuery<
	tListingTransactionLogQuery,
	tApiListingTransactionLogCollectionResponse[200]
>({
	keys(variables) {
		return [
			"listing-transaction-log",
			"collection",
			variables,
		];
	},
	async queryFn(body) {
		return apiListingTransactionLogCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
