import { getRootLogger } from "@/lib/client/log";
import { withMutation } from "@/lib/client/mutation";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/buyer/favourite/server/schema/FavouriteToggleSchema";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";

const logger = getRootLogger([
	"mutation",
	"withFavouriteToggleMutation",
]);

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
