import { withQuery } from "@use-pico/client/query";
import { apiFeedFavouriteCount } from "../../../api/buyer-user/sdk.gen";
import type { tApiFeedFavouriteCountResponse, tFeedQuery } from "../../../api/buyer-user/types.gen";

export const withFeedFavouriteCountQuery = withQuery<tFeedQuery, tApiFeedFavouriteCountResponse[200]>(
	{
		keys(data) {
			return [
				"feed-favourite",
				"count",
				data,
			];
		},
		async queryFn(body) {
			return apiFeedFavouriteCount({
				body,
				throwOnError: true,
			}).then((res) => res.data);
		},
	},
);
