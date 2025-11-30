import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionGalleryCreate } from "../../api/user/sdk.gen";
import type {
	apiListingTransactionGalleryCreateError,
	tApiListingTransactionGalleryCreateResponse,
	tListingTransactionGalleryCreate,
} from "../../api/user/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/user/withListingTransactionCollectionQuery";
import { withListingTransactionFetchQuery } from "../../query/user/withListingTransactionFetchQuery";
import { withListingTransactionLogCollectionQuery } from "../../query/user/withListingTransactionLogCollectionQuery";

export const withListingTransactionGalleryCreateMutation = withMutation<
	tListingTransactionGalleryCreate,
	tApiListingTransactionGalleryCreateResponse[200],
	apiListingTransactionGalleryCreateError
>({
	keys(variables) {
		return [
			"listing-transaction-gallery",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionGalleryCreate({
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
