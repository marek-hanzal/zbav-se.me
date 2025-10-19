import { withQuery } from "@use-pico/client";
import {
	apiListingFetch,
	type Listing,
	type ListingQuery,
} from "@zbav-se.me/sdk";

export const withListingFetchQuery = () => {
	return withQuery<ListingQuery, Listing>({
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
