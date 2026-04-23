import { withMutation } from "@/lib/client/mutation";
import { favouriteToggleFn } from "~/buyer/favourite/fn/favouriteToggleFn";
import type { FavouriteToggleSchema } from "~/buyer/favourite/server/schema/FavouriteToggleSchema";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
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
	invalidate: [
		{
			async invalidate(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
