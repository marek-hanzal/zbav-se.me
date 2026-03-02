import { withQuery } from "@use-pico/client/query";
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
	async queryFn(body) {
		return apiFavouriteCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
