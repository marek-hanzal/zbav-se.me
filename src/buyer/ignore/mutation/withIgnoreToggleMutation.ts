import { withMutation } from "@/lib/client/mutation";
import { ignoreToggleFn } from "~/buyer/ignore/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/buyer/ignore/server/schema/IgnoreToggleSchema";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
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
			"ignore",
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
