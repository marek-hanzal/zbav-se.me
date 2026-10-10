import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { thumbCreateFn } from "~/buyer-thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/buyer-thumb/schema/ThumbCreateSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";

export const withThumbCreateMutation = withMutationFn<
	ThumbCreateSchema.Type,
	ListingSchema.Type,
	thumbCreateFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withThumbCreateMutation",
	]),
	keysFn(variables) {
		return [
			"thumb",
			"create",
			variables,
		];
	},
	async mutationFn(data) {
		return thumbCreateFn({
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
