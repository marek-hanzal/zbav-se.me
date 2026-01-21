import { withQuery } from "@use-pico/client/query";
import { apiTransactionListingCollection } from "../../../api/user/sdk.gen";
import type {
	tApiTransactionListingCollectionResponse,
	tTransactionListingQuery,
} from "../../../api/user/types.gen";

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
	async queryFn(body) {
		return apiTransactionListingCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
