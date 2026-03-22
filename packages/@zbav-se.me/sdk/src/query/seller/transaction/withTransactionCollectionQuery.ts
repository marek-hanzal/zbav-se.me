import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionCollection } from "../../../api/seller/sdk.gen";
import type {
	tApiTransactionCollectionResponse,
	tTransactionQuery,
} from "../../../api/seller/types.gen";

export const withTransactionCollectionQuery = withQuery<
	tTransactionQuery,
	tApiTransactionCollectionResponse[200]
>({
	keys(variables) {
		return [
			"transaction",
			"collection",
			variables,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionCollection({
					body,
					headers,
				}),
			);
		},
	}),
});
