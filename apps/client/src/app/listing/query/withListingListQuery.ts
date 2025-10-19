import { withQuery } from "@use-pico/client";
import {
    apiListingCollection,
    type Listing,
    type ListingQuery,
} from "@zbav-se.me/sdk";

export const withListingListQuery = () => {
	return withQuery<ListingQuery, Listing[]>({
		keys(data) {
			return [
				"listing",
				"list",
				data,
			];
		},
		async queryFn(data) {
			return apiListingCollection(data).then((res) => res.data);
		},
	});
};
