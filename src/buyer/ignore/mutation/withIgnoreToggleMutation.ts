import { withMutation } from "@/lib/client/mutation";
import { ignoreToggleFn } from "~/buyer/ignore/server/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/buyer/ignore/server/schema/IgnoreToggleSchema";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";

export const withIgnoreToggleMutation = withMutation<
	IgnoreToggleSchema.Type,
	ListingSchema.Type,
	Error
>({
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
	invalidate: [],
});
