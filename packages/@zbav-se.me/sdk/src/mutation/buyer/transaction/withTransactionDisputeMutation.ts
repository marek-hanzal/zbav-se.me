import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionDispute } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionDisputeError,
	tApiTransactionDisputeRequest,
	tApiTransactionDisputeResponse,
} from "../../../api/buyer/types.gen";
import { withTransactionQuery } from "../../../query/buyer/transaction";
import { withTransactionEntryQuery } from "../../../query/user/transaction-entry";

export const withTransactionDisputeMutation = withMutation<
	tApiTransactionDisputeRequest,
	tApiTransactionDisputeResponse[200],
	apiTransactionDisputeError
>({
	keys(variables) {
		return [
			"transaction",
			"dispute",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionDispute(data));
	},
	invalidate: [
		{
			async invalidate(queryClient) {
				await withTransactionQuery.invalidator(queryClient, [
					"fetch",
				]);
				await withTransactionEntryQuery.invalidator(queryClient, [
					"collection",
					"count",
				]);
			},
		},
	],
});
