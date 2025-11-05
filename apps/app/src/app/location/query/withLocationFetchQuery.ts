import { withQuery } from "@use-pico/client/query";
import {
	apiLocationFetch,
	type tApiLocationFetchResponse,
	type tLocationQuery,
} from "@zbav-se.me/sdk/session";

export const withLocationFetchQuery = withQuery<
	tLocationQuery,
	tApiLocationFetchResponse[200]
>({
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
