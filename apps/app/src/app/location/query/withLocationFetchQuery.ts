import { withQuery } from "@use-pico/client";
import {
	apiLocationFetch,
	type LocationDto,
	type LocationQuery,
} from "@zbav-se.me/sdk";

export const withLocationFetchQuery = () => {
	return withQuery<LocationQuery, LocationDto>({
		keys(data) {
			return [
				"location",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			return apiLocationFetch(data).then((res) => res.data);
		},
	});
};
