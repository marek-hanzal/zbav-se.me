import { withQuery } from "@use-pico/client/query";
import { apiListingSellerInfo } from "../../../api/buyer-session/sdk.gen";
import type {
	tApiListingSellerInfoRequest,
	tApiListingSellerInfoResponse,
} from "../../../api/buyer-session/types.gen";

export const withListingSellerInfoQuery = withQuery<
	tApiListingSellerInfoRequest["path"],
	tApiListingSellerInfoResponse[200]
>({
	keys(variables) {
		return [
			"listing",
			"seller-info",
			variables,
		];
	},
	async queryFn(path) {
		return apiListingSellerInfo({
			path,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
