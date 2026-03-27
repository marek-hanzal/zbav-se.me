import { withMutation } from "@use-pico/client/mutation";
import { ignoreToggleFn } from "~/client/@buyer/ignore/server/fn/ignoreToggleFn";
import type { IgnoreToggleSchema } from "~/client/@buyer/ignore/server/schema/IgnoreToggleSchema";
import type { ListingSchema } from "~/client/@buyer/listing/server/schema/ListingSchema";

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
