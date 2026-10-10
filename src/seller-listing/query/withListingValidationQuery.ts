import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { listingValidateFn } from "~/seller-listing/fn/listingValidateFn";
import type { ListingValidateSchema } from "~/seller-listing/schema/ListingValidateSchema";

export const withListingValidationQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withListingValidationQuery",
	]),
	errors: {} as {
		query: listingValidateFn.Error;
	},
	keysFn(data: ListingValidateSchema.Type) {
		return [
			"listing",
			"validation",
			data,
		];
	},
	async queryFn(data: ListingValidateSchema.Type) {
		return listingValidateFn({
			data,
		});
	},
});
