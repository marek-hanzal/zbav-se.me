import { withQuery } from "@use-pico/client/query";
import { apiListingTransactionBuyerInfo } from "../../api/user/sdk.gen";
import type {
	tApiListingTransactionBuyerInfoResponse,
	tListingTransactionQuery,
} from "../../api/user/types.gen";

export const withListingTransactionBuyerInfoQuery = withQuery<
	tListingTransactionQuery,
	tApiListingTransactionBuyerInfoResponse[200]
>({
	keys(variables) {
		return [
			"listing-transaction",
			"buyer-info",
			variables,
		];
	},
	async queryFn(body) {
		return apiListingTransactionBuyerInfo({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
