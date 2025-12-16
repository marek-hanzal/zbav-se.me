import { withQuery } from "@use-pico/client/query";
import { apiDraftCollection } from "../../../api/user/sdk.gen";
import type { tApiDraftCollectionResponse, tDraftQuery } from "../../../api/user/types.gen";

export const withDraftCollectionQuery = withQuery<tDraftQuery, tApiDraftCollectionResponse[200]>({
	keys(data) {
		return [
			"draft",
			"list",
			data,
		];
	},
	async queryFn(body) {
		return apiDraftCollection({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
