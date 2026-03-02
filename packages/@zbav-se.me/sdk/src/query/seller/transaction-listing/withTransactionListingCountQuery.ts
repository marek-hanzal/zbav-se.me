import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiTransactionListingCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
