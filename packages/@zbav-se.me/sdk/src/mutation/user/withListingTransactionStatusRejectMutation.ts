import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionStatusReject } from "../../api/user/sdk.gen";
import type {
	apiListingTransactionStatusRejectError,
	tApiListingTransactionStatusRejectResponse,
	tListingTransactionStatusReject,
} from "../../api/user/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/user/withListingTransactionCollectionQuery";
import { withListingTransactionFetchQuery } from "../../query/user/withListingTransactionFetchQuery";
import { withListingTransactionLogCollectionQuery } from "../../query/user/withListingTransactionLogCollectionQuery";

export const withListingTransactionStatusRejectMutation = withMutation<
	tListingTransactionStatusReject,
	tApiListingTransactionStatusRejectResponse[200],
	apiListingTransactionStatusRejectError
>({
	keys(variables) {
		return [
			"listing-transaction",
			"status",
			"reject",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionStatusReject({
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
