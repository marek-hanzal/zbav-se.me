import { withQuery } from "@/lib/client/query";
import type { EntitySchema } from "@/lib/common/schema";
import { listingGetSellerInfoFn } from "~/buyer/listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

export const withListingSellerInfoQuery = withQuery<EntitySchema.Type, SellerInfoSchema.Type>({
	logger: getRootLogger([
		"query",
		"withListingSellerInfoQuery",
	]),
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
