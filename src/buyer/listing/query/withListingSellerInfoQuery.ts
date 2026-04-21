import { withQuery } from "@/lib/client/query";
import type { EntitySchema } from "@/lib/common/schema";
import { listingGetSellerInfoFn } from "~/buyer/listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";
import { getRootLogger } from "~/common/log/getRootLogger";

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
