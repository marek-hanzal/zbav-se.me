import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiFavouriteCount } from "../../../api/buyer/sdk.gen";
import type {
	tApiFavouriteCountResponse,
	tFavouriteCountQuery,
} from "../../../api/buyer/types.gen";

export const withFavouriteCountQuery = withQuery<
	tFavouriteCountQuery,
	tApiFavouriteCountResponse[200]
>({
	keys(data) {
		return [
			"favourite",
			"count",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiFavouriteCount({
					body,
					headers,
				}),
			);
		},
	}),
});
