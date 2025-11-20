import { withQuery } from "@use-pico/client/query";
import { apiListingTransactionSellerInfo } from "../../api/user/sdk.gen";
import type {
	tApiListingTransactionSellerInfoResponse,
	tListingTransactionQuery,
} from "../../api/user/types.gen";

export const withListingTransactionSellerInfoQuery = withQuery<
	tListingTransactionQuery,
	tApiListingTransactionSellerInfoResponse[200]
>({
	keys(variables) {
		return [
			"listing-transaction",
			"seller-info",
			variables,
		];
	},
	async queryFn(body) {
		return apiListingTransactionSellerInfo({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
