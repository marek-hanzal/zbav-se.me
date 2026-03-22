import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiTransactionListingCount } from "../../../api/seller/sdk.gen";
import type {
	tApiTransactionListingCountResponse,
	tTransactionListingCountQuery,
} from "../../../api/seller/types.gen";

export const withTransactionListingCountQuery = withQuery<
	tTransactionListingCountQuery,
	tApiTransactionListingCountResponse[200]
>({
	keys(data) {
		return [
			"transaction-listing",
			"count",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiTransactionListingCount({
					body,
					headers,
				}),
			);
		},
	}),
});
