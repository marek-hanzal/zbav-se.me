import { withQuery } from "@use-pico/client";
import {
	apiListingCount,
	type Count,
	type ListingQuery,
} from "@zbav-se.me/sdk";

export const withListingCountQuery = () => {
	return withQuery<ListingQuery, Count>({
		keys(data) {
			return [
				"listing",
				"count",
				data,
			];
		},
		async queryFn(data) {
			return apiListingCount(data).then((res) => res.data);
		},
	});
};
