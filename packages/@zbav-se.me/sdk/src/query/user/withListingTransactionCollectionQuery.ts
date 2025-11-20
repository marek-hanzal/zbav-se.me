import { withQuery } from "@use-pico/client/query";
import { apiListingTransactionCollection } from "../../api/user/sdk.gen";
import type {
	tApiListingTransactionCollectionResponse,
	tListingTransactionQuery,
} from "../../api/user/types.gen";

export const withListingTransactionCollectionQuery = withQuery<
	tListingTransactionQuery,
	tApiListingTransactionCollectionResponse[200]
>({
	keys(variables) {
		return [
			"listing-transaction",
			"collection",
			variables,
		];
	},
	async queryFn(body) {
		return apiListingTransactionCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
