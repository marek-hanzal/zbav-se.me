import { withMutation } from "@use-pico/client/mutation";
import type { ListingSchema } from "~/client/@buyer/listing/server/schema/ListingSchema";
import { thumbCreateFn } from "~/client/@buyer/thumb/server/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/client/@buyer/thumb/server/schema/ThumbCreateSchema";

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
