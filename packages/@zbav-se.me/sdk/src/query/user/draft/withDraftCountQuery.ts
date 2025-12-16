import { withQuery } from "@use-pico/client/query";
import { apiDraftCount } from "../../../api/user/sdk.gen";
import type { tApiDraftCountResponse, tDraftCountQuery } from "../../../api/user/types.gen";

export const withDraftCountQuery = withQuery<tDraftCountQuery, tApiDraftCountResponse[200]>({
	keys(data) {
		return [
			"draft",
			"count",
			data,
		];
	},
	async queryFn(body) {
		return apiDraftCount({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
