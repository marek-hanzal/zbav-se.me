import { withQuery } from "@use-pico/client/query";
import { apiDraftFetch } from "../../../api/user/sdk.gen";
import type { tApiDraftFetchResponse, tDraftQuery } from "../../../api/user/types.gen";

export const withDraftFetchQuery = withQuery<tDraftQuery, tApiDraftFetchResponse[200]>({
	keys(data) {
		return [
			"draft",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiDraftFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
