import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { favouriteToggleFn } from "~/buyer-listing-favourite/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/buyer-listing-favourite/schema/FavouriteToggleSchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";

export const withFavouriteToggleMutation = withMutation<
	FavouriteToggleSchema.Type,
	ListingSchema.Type,
	favouriteToggleFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withFavouriteToggleMutation",
	]),
	keys(variables) {
		return [
			"listing_favourite",
			"toggle",
			variables,
		];
	},
	async mutationFn(data) {
		return favouriteToggleFn({
			data,
		});
	},
	invalidate: [
		{
			async invalidate(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
