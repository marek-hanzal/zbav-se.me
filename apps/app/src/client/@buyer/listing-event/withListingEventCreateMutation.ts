import { withMutation } from "@use-pico/client/mutation";
import type { NoticeSchema } from "@use-pico/common/schema";
import { listingEventCreateFn } from "~/server/@buyer/listing-event/fn/listingEventCreateFn";
import type { ListingEventCreateSchema } from "~/server/@buyer/listing-event/schema/ListingEventCreateSchema";
import type { ListingEventSchema } from "~/server/@buyer/listing-event/schema/ListingEventSchema";

export const withListingEventCreateMutation = withMutation<
	ListingEventCreateSchema.Type,
	ListingEventSchema.Type,
	NoticeSchema.Type
>({
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
