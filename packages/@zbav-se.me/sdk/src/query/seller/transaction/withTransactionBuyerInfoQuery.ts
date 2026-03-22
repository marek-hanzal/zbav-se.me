import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import {
	apiTransactionBuyerInfo,
	type tApiTransactionBuyerInfoRequest,
	type tApiTransactionBuyerInfoResponse,
} from "@zbav-se.me/sdk/api/seller";

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
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionBuyerInfo({
					body,
					headers,
				}),
			);
		},
	}),
});
