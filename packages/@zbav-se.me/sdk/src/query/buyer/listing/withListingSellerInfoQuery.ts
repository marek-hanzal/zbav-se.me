import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiListingSellerInfo } from "../../../api/buyer/sdk.gen";
import type {
	tApiListingSellerInfoRequest,
	tApiListingSellerInfoResponse,
} from "../../../api/buyer/types.gen";

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
	queryFn: isomorphicFn({
		requestFn(path, headers) {
			return withApi(
				apiListingSellerInfo({
					path,
					headers,
				}),
			);
		},
	}),
});
