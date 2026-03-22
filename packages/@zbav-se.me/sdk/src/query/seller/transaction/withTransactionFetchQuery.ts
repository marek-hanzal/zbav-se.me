import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionFetch } from "../../../api/seller/sdk.gen";
import type {
	tApiTransactionFetchResponse,
	tTransactionQuery,
} from "../../../api/seller/types.gen";

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
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
