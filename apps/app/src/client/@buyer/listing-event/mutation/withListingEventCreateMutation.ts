import { withMutation } from "@use-pico/client/mutation";
import type { NoticeSchema } from "@use-pico/common/schema";
import { listingEventCreateFn } from "~/client/@buyer/listing-event/server/fn/listingEventCreateFn";
import type { ListingEventCreateSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventCreateSchema";
import type { ListingEventSchema } from "~/client/@buyer/listing-event/server/schema/ListingEventSchema";

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
