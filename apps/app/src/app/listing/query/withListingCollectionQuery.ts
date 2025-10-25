import { withQuery } from "@use-pico/client";
import {
	apiListingCollection,
	type ListingCollection,
	type ListingQuery,
} from "@zbav-se.me/sdk";

export const withListingCollectionQuery = () => {
	return withQuery<ListingQuery, ListingCollection>({
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
