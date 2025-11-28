import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionMessageCreate } from "../../api/user/sdk.gen";
import type {
	apiListingTransactionMessageCreateError,
	tApiListingTransactionMessageCreateResponse,
	tListingTransactionMessageCreate,
} from "../../api/user/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/user/withListingTransactionCollectionQuery";
import { withListingTransactionFetchQuery } from "../../query/user/withListingTransactionFetchQuery";
import { withListingTransactionLogCollectionQuery } from "../../query/user/withListingTransactionLogCollectionQuery";

export const withListingTransactionMessageCreateMutation = withMutation<
	tListingTransactionMessageCreate,
	tApiListingTransactionMessageCreateResponse[200],
	apiListingTransactionMessageCreateError
>({
	keys(variables) {
		return [
			"listing-transaction-message",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionMessageCreate({
				body,
			}),
		);
	},
	invalidate: [
		withListingTransactionLogCollectionQuery,
		withListingTransactionFetchQuery,
		withListingTransactionCollectionQuery,
	],
});
