import { withQuery } from "@use-pico/client/query";
import { apiTransactionBuyerInfo } from "../../../api/buyer-session/sdk.gen";
import type {
	tApiTransactionBuyerInfoResponse,
	tTransactionQuery,
} from "../../../api/buyer-session/types.gen";

export const withTransactionBuyerInfoQuery = withQuery<
	tTransactionQuery,
	tApiTransactionBuyerInfoResponse[200]
>({
	keys(variables) {
		return [
			"transaction",
			"buyer-info",
			variables,
		];
	},
	async queryFn(body) {
		return apiTransactionBuyerInfo({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
