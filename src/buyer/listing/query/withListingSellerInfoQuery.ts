import { withQuery } from "@/lib/client/query";
import type { EntitySchema } from "@/lib/common/schema";
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
