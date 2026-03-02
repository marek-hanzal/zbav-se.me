import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusReject } from "../../../api/seller/sdk.gen";
import type {
	apiTransactionStatusRejectError,
	tApiTransactionStatusRejectResponse,
	tTransactionStatusReject,
} from "../../../api/seller/types.gen";
import { withTransactionFetchQuery } from "../../../query/seller/transaction/withTransactionFetchQuery";

export const withTransactionStatusRejectMutation = withMutation<
	tTransactionStatusReject,
	tApiTransactionStatusRejectResponse[200],
	apiTransactionStatusRejectError
>({
	keys(variables) {
		return [
			"transaction",
			"status",
			"reject",
			variables,
		];
	},
	async mutationFn(body) {
		return withApi(
			apiTransactionStatusReject({
				body,
			}),
		);
	},
	invalidate: [
		withTransactionFetchQuery,
	],
});
