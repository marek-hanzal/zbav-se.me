import { withQuery } from "@use-pico/client/query";
import { apiUploadFetch } from "../../api/session/sdk.gen";
import type { tApiUploadFetchResponse, tUploadQuery } from "../../api/session/types.gen";

export const withUploadFetchQuery = withQuery<tUploadQuery, tApiUploadFetchResponse[200]>({
	keys(variables) {
		return [
			"upload",
			"fetch",
			variables,
		];
	},
	async queryFn(body) {
		return apiUploadFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
