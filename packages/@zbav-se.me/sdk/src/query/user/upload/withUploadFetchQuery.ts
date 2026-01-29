import { withQuery } from "@use-pico/client/query";
import { apiUploadFetch } from "../../../api/user/sdk.gen";
import type { tApiUploadFetchResponse, tUploadQuery } from "../../../api/user/types.gen";

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
		}).then((res: { data: tApiUploadFetchResponse[200] }) => res.data);
	},
});
