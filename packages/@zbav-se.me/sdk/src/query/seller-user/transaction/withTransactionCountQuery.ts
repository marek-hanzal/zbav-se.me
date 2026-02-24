import { withQuery } from "@use-pico/client/query";
import { apiTransactionCount } from "../../../api/seller-user/sdk.gen";
import type {
	tApiTransactionCountResponse,
	tTransactionCountQuery,
} from "../../../api/seller-user/types.gen";

export const withTransactionCountQuery = withQuery<
	tTransactionCountQuery,
	tApiTransactionCountResponse[200]
>({
	keys(data) {
		return [
			"transaction",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiTransactionCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
