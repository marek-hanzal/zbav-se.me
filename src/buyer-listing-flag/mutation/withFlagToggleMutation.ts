import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { flagToggleFn } from "~/buyer-listing-flag/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/buyer-listing-flag/schema/FlagToggleSchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";

export const withFlagToggleMutation = withMutation<
	FlagToggleSchema.Type,
	ListingSchema.Type,
	flagToggleFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withFlagToggleMutation",
	]),
	keys(variables) {
		return [
			"listing_flag",
			"toggle",
			variables,
		];
	},
	async mutationFn(data) {
		return flagToggleFn({
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
