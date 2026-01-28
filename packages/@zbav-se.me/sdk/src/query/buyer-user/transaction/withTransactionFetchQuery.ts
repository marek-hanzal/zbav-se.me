import { withQuery } from "@use-pico/client/query";
import { apiTransactionFetch } from "../../../api/buyer-user/sdk.gen";
import type { tApiTransactionFetchResponse, tTransactionQuery } from "../../../api/buyer-user/types.gen";

export const withTransactionFetchQuery = withQuery<
	tTransactionQuery,
	tApiTransactionFetchResponse[200]
>({
	keys(variables) {
		return [
			"transaction",
			"fetch",
			variables,
		];
	},
	async queryFn(body) {
		return apiTransactionFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
