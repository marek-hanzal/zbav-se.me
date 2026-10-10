import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { listingValidateFn } from "~/seller-listing/fn/listingValidateFn";
import type { ListingValidateSchema } from "~/seller-listing/schema/ListingValidateSchema";

export const withListingValidationQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withListingValidationQuery",
	]),
	errors: {} as {
		query: listingValidateFn.Error;
	},
	keys(data: ListingValidateSchema.Type) {
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
