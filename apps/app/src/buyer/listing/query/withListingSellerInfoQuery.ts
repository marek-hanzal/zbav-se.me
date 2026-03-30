import type { EntitySchema } from "@use-pico/common/schema";
import { withQuery } from "@/lib/client/query";
import { listingGetSellerInfoFn } from "~/buyer/listing/server/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";

export const withListingSellerInfoQuery = withQuery<EntitySchema.Type, SellerInfoSchema.Type>({
	keys(variables) {
		return [
			"listing",
			"seller-info",
			variables,
		];
	},
	async queryFn(data) {
		return listingGetSellerInfoFn({
			data,
		});
	},
});
