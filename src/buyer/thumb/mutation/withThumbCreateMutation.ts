import { getRootLogger } from "@/lib/client/log";
import { withMutation } from "@/lib/client/mutation";
import type { ListingSchema } from "~/buyer/listing/server/schema/ListingSchema";
import { thumbCreateFn } from "~/buyer/thumb/fn/thumbCreateFn";
import type { ThumbCreateSchema } from "~/buyer/thumb/server/schema/ThumbCreateSchema";

const logger = getRootLogger([
	"mutation",
	"withThumbCreateMutation",
]);

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
		logger.trace("withThumbCreateMutation", data);

		return thumbCreateFn({
			data,
		});
	},
	invalidate: [],
});
