import { withMutation } from "@use-pico/client";
import {
	apiListingCreate,
	type Listing,
	type ListingCreate,
} from "@zbav-se.me/sdk";

export const withListingCreateMutation = () => {
	return withMutation<ListingCreate, Listing>({
		keys() {
			return [
				"listing",
				"create",
			];
		},
		async mutationFn(data) {
			return apiListingCreate(data).then((res) => res.data);
		},
	});
};
