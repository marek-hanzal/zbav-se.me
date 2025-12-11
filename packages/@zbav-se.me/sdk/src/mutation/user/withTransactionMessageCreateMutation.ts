import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionMessageCreate } from "../../api/user/sdk.gen";
import type {
	apiTransactionMessageCreateError,
	tApiTransactionMessageCreateResponse,
	tTransactionMessageCreate,
} from "../../api/user/types.gen";
import { withTransactionCollectionQuery } from "../../query/user/withTransactionCollectionQuery";
import { withTransactionFetchQuery } from "../../query/user/withTransactionFetchQuery";
import { withTransactionLogCollectionQuery } from "../../query/user/withTransactionLogCollectionQuery";

export const withTransactionMessageCreateMutation = withMutation<
	tTransactionMessageCreate,
	tApiTransactionMessageCreateResponse[200],
	apiTransactionMessageCreateError
>({
	keys(variables) {
		return [
			"transaction-message",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionMessageCreate({
				body,
			}),
		);
	},
	invalidate: [
		withTransactionLogCollectionQuery,
		withTransactionFetchQuery,
		withTransactionCollectionQuery,
	],
});
