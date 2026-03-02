import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionStatusReject } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionStatusRejectError,
	tApiTransactionStatusRejectResponse,
	tTransactionStatusReject,
} from "../../../api/buyer/types.gen";
import { withTransactionFetchQuery } from "../../../query/buyer/transaction/withTransactionFetchQuery";

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
