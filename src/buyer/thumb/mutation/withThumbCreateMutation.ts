import { withMutation } from "@/lib/client/mutation";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { thumbCreateFn } from "~/buyer/thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/buyer/thumb/server/schema/ThumbCreateSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withThumbCreateMutation = withMutation<
	ThumbCreateSchema.Type,
	ListingSchema.Type,
	thumbCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withThumbCreateMutation",
	]),
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
