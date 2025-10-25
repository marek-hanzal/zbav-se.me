import { withMutation } from "@use-pico/client";
import {
	apiListingCreate,
	type ListingCreate,
	type ListingDto,
} from "@zbav-se.me/sdk";

export const withListingCreateMutation = () => {
	return withMutation<ListingCreate, ListingDto>({
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
