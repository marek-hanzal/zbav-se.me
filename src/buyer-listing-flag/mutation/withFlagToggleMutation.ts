import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { flagToggleFn } from "~/buyer-listing-flag/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/buyer-listing-flag/schema/FlagToggleSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";

export const withFlagToggleMutation = withMutationFn<
	FlagToggleSchema.Type,
	ListingSchema.Type,
	flagToggleFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withFlagToggleMutation",
	]),
	keysFn(variables) {
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
			async invalidateFn(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
