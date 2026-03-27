import { withMutation } from "@use-pico/client/mutation";
import { flagToggleFn } from "~/client/@buyer/flag/server/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/client/@buyer/flag/server/schema/FlagToggleSchema";
import type { ListingSchema } from "~/client/@buyer/listing/server/schema/ListingSchema";

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
