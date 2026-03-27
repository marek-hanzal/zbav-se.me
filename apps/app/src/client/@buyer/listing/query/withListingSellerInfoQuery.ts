import { withQuery } from "@use-pico/client/query";
import type { EntitySchema } from "@use-pico/common/schema";
import { listingGetSellerInfoFn } from "~/client/@buyer/listing/server/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/client/@buyer/listing/server/schema/SellerInfoSchema";

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
