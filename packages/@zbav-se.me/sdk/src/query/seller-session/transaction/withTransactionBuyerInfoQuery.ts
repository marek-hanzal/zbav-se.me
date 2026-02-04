import { withQuery } from "@use-pico/client/query";
import {
	apiTransactionBuyerInfo,
	type tApiTransactionBuyerInfoRequest,
	type tApiTransactionBuyerInfoResponse,
} from "@zbav-se.me/sdk/api/seller-session";

export const withTransactionBuyerInfoQuery = withQuery<
	tApiTransactionBuyerInfoRequest["body"],
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
