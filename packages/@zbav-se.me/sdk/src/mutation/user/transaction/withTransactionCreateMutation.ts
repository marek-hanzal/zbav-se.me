import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionCreate } from "../../../api/user/sdk.gen";
import type {
	apiTransactionCreateError,
	tApiTransactionCreateResponse,
	tTransactionCreate,
} from "../../../api/user/types.gen";
import { withListingCollectionQuery } from "../../../query/user/listing/withListingCollectionQuery";
import { withListingFetchQuery } from "../../../query/user/listing/withListingFetchQuery";
import { withTransactionCollectionQuery } from "../../../query/user/transaction/withTransactionCollectionQuery";

export const withTransactionCreateMutation = withMutation<
	tTransactionCreate,
	tApiTransactionCreateResponse[201],
	apiTransactionCreateError
>({
	keys(variables) {
		return [
			"transaction",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionCreate({
				body,
			}),
		);
	},
	invalidate: [
		withListingCollectionQuery,
		withListingFetchQuery,
		withTransactionCollectionQuery,
	],
});
