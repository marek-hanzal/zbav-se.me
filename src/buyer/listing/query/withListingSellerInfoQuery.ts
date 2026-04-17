import { getRootLogger } from "@/lib/client/log";
import { withQuery } from "@/lib/client/query";
import type { EntitySchema } from "@/lib/common/schema";
import { listingGetSellerInfoFn } from "~/buyer/listing/fn/listingGetSellerInfoFn";
import type { SellerInfoSchema } from "~/buyer/listing/server/schema/SellerInfoSchema";

const logger = getRootLogger([
	"query",
	"withListingSellerInfoQuery",
]);

export const withListingSellerInfoQuery = withQuery<EntitySchema.Type, SellerInfoSchema.Type>({
	keys(variables) {
		return [
			"listing",
			"seller-info",
			variables,
		];
	},
	async queryFn(data) {
		logger.trace("queryFn", data);

		return listingGetSellerInfoFn({
			data,
		});
	},
});
