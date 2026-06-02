import { withMutation } from "@/lib/client/mutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { favouriteToggleFn } from "~/buyer/listing-favourite/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/buyer/listing-favourite/server/schema/FavouriteToggleSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

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
