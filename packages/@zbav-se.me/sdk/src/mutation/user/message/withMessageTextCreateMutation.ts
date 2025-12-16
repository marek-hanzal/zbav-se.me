import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiMessageTextCreate } from "../../../api/user/sdk.gen";
import type {
	apiMessageTextCreateError,
	tApiMessageTextCreateResponse,
	tMessageTextCreate,
} from "../../../api/user/types.gen";
import { withTransactionCollectionQuery } from "../../../query/user/transaction/withTransactionCollectionQuery";
import { withTransactionFetchQuery } from "../../../query/user/transaction/withTransactionFetchQuery";

export const withMessageTextCreateMutation = withMutation<
	tMessageTextCreate,
	tApiMessageTextCreateResponse[200],
	apiMessageTextCreateError
>({
	keys(variables) {
		return [
			"message-text",
			"create",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiMessageTextCreate({
				body,
			}),
		);
	},
	invalidate: [
		withTransactionCollectionQuery,
		withTransactionFetchQuery,
	],
});
