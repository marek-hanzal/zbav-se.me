import { withMutation } from "@/lib/client/mutation";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { thumbCreateFn } from "~/buyer/thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/buyer/thumb/server/schema/ThumbCreateSchema";

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
