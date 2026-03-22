import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
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
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiUploadFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
