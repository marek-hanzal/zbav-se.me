import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionPatch } from "../../api/user/sdk.gen";
import type {
	apiListingTransactionPatchError,
	tApiListingTransactionPatchResponse,
	tListingTransactionPatch,
} from "../../api/user/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/user/withListingTransactionCollectionQuery";
import { withListingTransactionFetchQuery } from "../../query/user/withListingTransactionFetchQuery";
import { withListingTransactionLogCollectionQuery } from "../../query/user/withListingTransactionLogCollectionQuery";

export const withListingTransactionPatchMutation = withMutation<
	tListingTransactionPatch,
	tApiListingTransactionPatchResponse[200],
	apiListingTransactionPatchError
>({
	keys(variables) {
		return [
			"listing-transaction",
			"patch",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionPatch({
				body,
			}),
		);
	},
	invalidate: [
		withListingTransactionCollectionQuery,
		withListingTransactionFetchQuery,
		withListingTransactionLogCollectionQuery,
	],
});
