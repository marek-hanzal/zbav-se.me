import { withMutation } from "@/lib/client/mutation";
import { listingEventCreateFn } from "~/buyer/listing-event/fn/listingEventCreateFn";
import type { ListingEventCreateSchema } from "~/buyer/listing-event/server/schema/ListingEventCreateSchema";
import type { ListingEventSchema } from "~/buyer/listing-event/server/schema/ListingEventSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withListingEventCreateMutation = withMutation<
	ListingEventCreateSchema.Type,
	ListingEventSchema.Type,
	Error
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
