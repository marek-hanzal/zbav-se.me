import { withMutation } from "@/lib/client/mutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { ignoreToggleFn } from "~/buyer/listing-ignore/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/buyer/listing-ignore/server/schema/IgnoreToggleSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withIgnoreToggleMutation = withMutation<
	IgnoreToggleSchema.Type,
	ListingSchema.Type,
	ignoreToggleFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withIgnoreToggleMutation",
	]),
	keys(variables) {
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
			async invalidate(queryClient, result) {
				result && withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
