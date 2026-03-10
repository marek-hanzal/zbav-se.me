import { withMutation } from "@use-pico/client/mutation";
import { withApi } from "@use-pico/common/api";
import { apiTransactionReject } from "../../../api/buyer/sdk.gen";
import type {
	apiTransactionRejectError,
	tApiTransactionRejectRequest,
	tApiTransactionRejectResponse,
} from "../../../api/buyer/types.gen";
import { withTransactionFetchQuery } from "../../../query/buyer/transaction/withTransactionFetchQuery";

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
		withTransactionFetchQuery,
	],
});
