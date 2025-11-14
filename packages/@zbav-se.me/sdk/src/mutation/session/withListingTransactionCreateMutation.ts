import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiListingTransactionCreate } from "../../api/session/sdk.gen";
import type {
	apiListingTransactionCreateError,
	tApiListingTransactionCreateResponse,
	tListingTransactionCreate,
} from "../../api/session/types.gen";
import { withListingTransactionCollectionQuery } from "../../query/session/withListingTransactionCollectionQuery";

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
