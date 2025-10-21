import { withMutation } from "@use-pico/client";
import {
	apiListingGalleryCreate,
	type ListingGalleryCreate,
} from "@zbav-se.me/sdk";

export const withListingGalleryCreateMutation = withMutation<
	ListingGalleryCreate,
	void
>({
	keys(variables) {
		return [
			"listing",
			"gallery",
			"create",
			variables,
		];
	},
	async mutationFn(variables) {
		return apiListingGalleryCreate(variables).then((res) => res.data);
	},
});
