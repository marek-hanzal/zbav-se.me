import { withMutation } from "@use-pico/client/mutation";
import { ignoreToggleFn } from "~/server/@buyer/ignore/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/server/@buyer/ignore/schema/IgnoreToggleSchema";
import type { ListingSchema } from "~/server/@buyer/listing/schema/ListingSchema";

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
