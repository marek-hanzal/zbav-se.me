import { listingEventCreateFn } from "~/buyer-listing-event/fn/listingEventCreateFn";
import type { ListingEventCreateSchema } from "~/buyer-listing-event/schema/ListingEventCreateSchema";
import type { ListingEventSchema } from "~/buyer-listing-event/schema/ListingEventSchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";

export const withListingEventCreateMutation = withMutation<
	ListingEventCreateSchema.Type,
	ListingEventSchema.Type,
	listingEventCreateFn.Error
>({
	logger: getRootLogger([
		"mutation",
		"withListingEventCreateMutation",
	]),
	keys(variables) {
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
