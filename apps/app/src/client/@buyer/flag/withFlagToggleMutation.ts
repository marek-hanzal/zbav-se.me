import { withMutation } from "@use-pico/client/mutation";
import { flagToggleFn } from "~/server/@buyer/flag/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/server/@buyer/flag/schema/FlagToggleSchema";
import type { ListingSchema } from "~/server/@buyer/listing/schema/ListingSchema";

export const withFlagToggleMutation = withMutation<
	FlagToggleSchema.Type,
	ListingSchema.Type,
	Error
>({
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
	invalidate: [],
});
