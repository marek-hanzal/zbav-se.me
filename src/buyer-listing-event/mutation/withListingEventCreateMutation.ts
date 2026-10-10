import { listingEventCreateFn } from "~/buyer-listing-event/fn/listingEventCreateFn";
import type { ListingEventCreateSchema } from "~/buyer-listing-event/schema/ListingEventCreateSchema";
import type { ListingEventSchema } from "~/buyer-listing-event/schema/ListingEventSchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";

export const withListingEventCreateMutation = withMutationFn<
	ListingEventCreateSchema.Type,
	ListingEventSchema.Type,
	listingEventCreateFn.Error
>({
	logger: getRootLoggerFn([
		"mutation",
		"withListingEventCreateMutation",
	]),
	keysFn(variables) {
		return [
			"listing-event",
			"create",
			variables,
		];
	},
	async mutationFn(data) {
		return listingEventCreateFn({
			data,
		});
	},
	invalidate: [],
});
