import { withMutation } from "@/lib/client/mutation";
import { flagToggleFn } from "~/buyer/flag/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/buyer/flag/server/schema/FlagToggleSchema";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

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
			"flag",
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
				withListingQuery.updateFn(queryClient, result);
			},
		},
	],
});
