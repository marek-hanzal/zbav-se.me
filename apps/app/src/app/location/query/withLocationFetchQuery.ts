import { withQuery } from "@use-pico/client";
import {
	apiLocationFetch,
	type tLocationDto,
	type tLocationQuery,
} from "@zbav-se.me/sdk";

export const withLocationFetchQuery = withQuery<tLocationQuery, tLocationDto>({
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
