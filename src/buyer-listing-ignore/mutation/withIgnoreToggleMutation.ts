import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { ignoreToggleFn } from "~/buyer-listing-ignore/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/buyer-listing-ignore/schema/IgnoreToggleSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";

export const withIgnoreToggleMutation = withMutationFn<
	IgnoreToggleSchema.Type,
	ListingSchema.Type,
	ignoreToggleFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withIgnoreToggleMutation",
	]),
	keysFn(variables) {
		return [
			"listing_ignore",
			"toggle",
			variables,
		];
	},
	async mutationFn(data) {
		return ignoreToggleFn({
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
