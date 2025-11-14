import { withQuery } from "@use-pico/client/query";
import { apiLocationFetch } from "../../api/session/sdk.gen";
import type { tApiLocationFetchResponse, tLocationQuery } from "../../api/session/types.gen";

export const withLocationFetchQuery = withQuery<tLocationQuery, tApiLocationFetchResponse[200]>({
	keys(data) {
		return [
			"location",
			"fetch",
			data,
		];
	},
	async queryFn(body) {
		return apiLocationFetch({
			body,
			throwOnError: true,
		}).then((res) => res.data);
	},
});
