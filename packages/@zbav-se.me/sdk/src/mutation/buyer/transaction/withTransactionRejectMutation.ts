import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionReject } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionRejectError,
	tApiTransactionRejectRequest,
	tApiTransactionRejectResponse,
} from "../../../api/buyer/types.gen";
import { withTransactionQuery } from "../../../query/buyer/transaction";
import { withTransactionEntryQuery } from "../../../query/user/transaction-entry";

export const withTransactionRejectMutation = withMutation<
	tApiTransactionRejectRequest,
	tApiTransactionRejectResponse[200],
	apiTransactionRejectError
>({
	keys(variables) {
		return [
			"transaction",
			"reject",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionReject(data));
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
