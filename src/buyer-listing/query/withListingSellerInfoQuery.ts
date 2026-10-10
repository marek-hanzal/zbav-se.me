import { listingGetSellerInfoFn } from "~/buyer-listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer-listing/schema/SellerInfoSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";

export const withListingSellerInfoQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withListingSellerInfoQuery",
	]),
	errors: {} as {
		query: listingGetSellerInfoFn.Error;
	},
	keysFn(variables: EntitySchema.Type) {
		return [
			"listing",
			"seller-info",
			variables,
		];
	},
	async queryFn(data: EntitySchema.Type): Promise<SellerInfoSchema.Type> {
		return listingGetSellerInfoFn({
			data,
		});
	},
});
