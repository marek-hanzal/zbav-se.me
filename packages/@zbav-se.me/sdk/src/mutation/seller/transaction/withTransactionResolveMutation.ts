import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionResolve } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionResolveError,
	tApiTransactionResolveRequest,
	tApiTransactionResolveResponse,
} from "../../../api/seller/types.gen";
import { withTransactionQuery } from "../../../query/seller/transaction";
import { withTransactionEntryQuery } from "../../../query/user/transaction-entry";

export const withTransactionResolveMutation = withMutation<
	tApiTransactionResolveRequest,
	tApiTransactionResolveResponse[200],
	apiTransactionResolveError
>({
	keys(variables) {
		return [
			"transaction",
			"resolve",
			variables,
		];
	},
	async mutationFn(data) {
		return withApi(apiTransactionResolve(data));
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
