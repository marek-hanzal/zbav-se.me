import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionCreate } from "~/api/user/sdk.gen";
import type {
	apiListingTransactionCreateError,
	tApiListingTransactionCreateResponse,
	tListingTransactionCreate,
} from "~/api/user/types.gen";
import { withListingTransactionCollectionQuery } from "~/query/user/withListingTransactionCollectionQuery";

export const withListingTransactionCreateMutation = withMutation<
	tListingTransactionCreate,
	tApiListingTransactionCreateResponse[201],
	apiListingTransactionCreateError
>({
	keys(variables) {
		return [
			"listing-transaction",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiListingTransactionCreate({
				body,
			}),
		);
	},
	invalidate: [
		withListingTransactionCollectionQuery,
	],
});
