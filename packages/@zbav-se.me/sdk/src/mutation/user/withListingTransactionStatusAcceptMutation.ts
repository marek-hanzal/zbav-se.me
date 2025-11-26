import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionStatusAccept } from "../../api/user/sdk.gen";
import type {
	apiListingTransactionStatusAcceptError,
	tApiListingTransactionStatusAcceptResponse,
	tListingTransactionStatusAccept,
} from "../../api/user/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/user/withListingTransactionCollectionQuery";
import { withListingTransactionFetchQuery } from "../../query/user/withListingTransactionFetchQuery";
import { withListingTransactionLogCollectionQuery } from "../../query/user/withListingTransactionLogCollectionQuery";

export const withListingTransactionStatusAcceptMutation = withMutation<
	tListingTransactionStatusAccept,
	tApiListingTransactionStatusAcceptResponse[200],
	apiListingTransactionStatusAcceptError
>({
	keys(variables) {
		return [
			"listing-transaction",
			"status",
			"accept",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionStatusAccept({
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
