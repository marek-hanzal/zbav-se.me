import { listingGetSellerInfoFn } from "~/buyer-listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer-listing/schema/SellerInfoSchema";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";

export const withListingSellerInfoQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withListingSellerInfoQuery",
	]),
	errors: {} as {
		query: listingGetSellerInfoFn.Error;
	},
	keys(variables: EntitySchema.Type) {
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
