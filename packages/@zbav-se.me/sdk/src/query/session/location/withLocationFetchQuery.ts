import { withQuery } from "@use-pico/client/query";
import { isomorphicFn } from "@use-pico/client/utils";
import { withApi } from "@use-pico/common/api";
import { apiLocationFetch } from "../../../api/session/sdk.gen";
import type { tApiLocationFetchResponse, tLocationQuery } from "../../../api/session/types.gen";

export const withLocationFetchQuery = withQuery<tLocationQuery, tApiLocationFetchResponse[200]>({
	keys(data) {
		return [
			"location",
			"fetch",
			data,
		];
	},
	queryFn: isomorphicFn({
		requestFn(body, headers) {
			return withApi(
				apiLocationFetch({
					body,
					headers,
				}),
			);
		},
	}),
});
