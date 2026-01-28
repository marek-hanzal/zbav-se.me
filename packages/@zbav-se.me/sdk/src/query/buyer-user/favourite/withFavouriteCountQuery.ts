import { withQuery } from "@use-pico/client/query";
import { apiFavouriteCount } from "../../../api/buyer-user/sdk.gen";
import type { tApiFavouriteCountResponse, tFavouriteCountQuery } from "../../../api/buyer-user/types.gen";

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
	async queryFn(body) {
		return apiFavouriteCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
