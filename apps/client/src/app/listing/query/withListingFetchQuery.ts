import { withQuery } from "@use-pico/client";
import {
	apiListingFetch,
	type ListingDto,
	type ListingQuery,
} from "@zbav-se.me/sdk";

export const withListingFetchQuery = () => {
	return withQuery<ListingQuery, ListingDto>({
		keys(data) {
			return [
				"listing",
				"fetch",
				data,
			];
		},
		async queryFn(data) {
			return apiListingFetch(data).then((res) => res.data);
		},
	});
};
