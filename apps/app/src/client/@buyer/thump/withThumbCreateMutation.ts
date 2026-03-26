import { withMutation } from "@use-pico/client/mutation";
import type { ListingSchema } from "~/server/@buyer/listing/schema/ListingSchema";
import { thumbCreateFn } from "~/server/@buyer/thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/server/@buyer/thumb/schema/ThumbCreateSchema";

export const withThumbCreateMutation = withMutation<
	ThumbCreateSchema.Type,
	ListingSchema.Type,
	Error
>({
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
	invalidate: [],
});
