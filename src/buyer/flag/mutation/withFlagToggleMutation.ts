import { withMutation } from "@/lib/client/mutation";
import { flagToggleFn } from "~/buyer/flag/fn/flagToggleFn";
import type { FlagToggleSchema } from "~/buyer/flag/server/schema/FlagToggleSchema";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";

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
