import { withQuery } from "@use-pico/client/query";
import type { EntitySchema } from "@use-pico/common/schema";
import { listingGetSellerInfoFn } from "~/server/@buyer/listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/server/@buyer/listing/schema/SellerInfoSchema";

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
