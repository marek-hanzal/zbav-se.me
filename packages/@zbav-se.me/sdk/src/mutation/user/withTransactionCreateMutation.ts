import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionCreate } from "../../api/user/sdk.gen";
import type {
	apiTransactionCreateError,
	tApiTransactionCreateResponse,
	tTransactionCreate,
} from "../../api/user/types.gen";
import { withListingCollectionQuery, withListingFetchQuery } from "../../query/user";
import { withTransactionCollectionQuery } from "../../query/user/withTransactionCollectionQuery";

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
