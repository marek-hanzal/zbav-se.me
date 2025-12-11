import { withQuery } from "@use-pico/client/query";
import { apiTransactionSellerInfo } from "../../api/user/sdk.gen";
import type {
	tApiTransactionSellerInfoResponse,
	tTransactionQuery,
} from "../../api/user/types.gen";

export const withTransactionSellerInfoQuery = withQuery<
	tTransactionQuery,
	tApiTransactionSellerInfoResponse[200]
>({
	keys(variables) {
		return [
			"transaction",
			"seller-info",
			variables,
		];
	},
	async queryFn(body) {
		return apiTransactionSellerInfo({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
