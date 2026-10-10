import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { favouriteToggleFn } from "~/buyer-listing-favourite/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/buyer-listing-favourite/schema/FavouriteToggleSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";

export const withFavouriteToggleMutation = withMutationFn<
	FavouriteToggleSchema.Type,
	ListingSchema.Type,
	favouriteToggleFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withFavouriteToggleMutation",
	]),
	keysFn(variables) {
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
			async invalidateFn(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
