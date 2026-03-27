import { withMutation } from "@use-pico/client/mutation";
import { favouriteToggleFn } from "~/client/@buyer/favourite/server/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/client/@buyer/favourite/server/schema/FavouriteToggleSchema";
import type { ListingSchema } from "~/server/@buyer/listing/schema/ListingSchema";

export const withFavouriteToggleMutation = withMutation<
	FavouriteToggleSchema.Type,
	ListingSchema.Type,
	Error
>({
	keys(variables) {
		return [
			"favourite",
			"toggle",
			variables,
		];
	},
	async mutationFn(data) {
		return favouriteToggleFn({
			data,
		});
	},
	invalidate: [],
});
