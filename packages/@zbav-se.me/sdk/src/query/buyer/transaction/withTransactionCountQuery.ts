import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionCount } from "../../../api/buyer/sdk.gen";
import type {
	tApiTransactionCountResponse,
	tTransactionCountQuery,
} from "../../../api/buyer/types.gen";

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
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionCount({
					body,
					headers,
				}),
			);
		},
	}),
});
