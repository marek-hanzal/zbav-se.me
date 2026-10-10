import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer-listing/schema/ListingSchema";
import { thumbCreateFn } from "~/buyer-thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/buyer-thumb/schema/ThumbCreateSchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";

export const withThumbCreateMutation = withMutation<
	ThumbCreateSchema.Type,
	ListingSchema.Type,
	thumbCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withThumbCreateMutation",
	]),
	keys(variables) {
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
			async invalidate(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
