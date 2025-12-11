import { withQuery } from "@use-pico/client/query";
import { apiTransactionBuyerInfo } from "../../api/user/sdk.gen";
import type {
	tApiTransactionBuyerInfoResponse,
	tTransactionQuery,
} from "../../api/user/types.gen";

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
