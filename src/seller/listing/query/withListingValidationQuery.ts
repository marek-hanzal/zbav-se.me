import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingValidateFn } from "../fn/listingValidateFn";
import type { ListingValidateSchema } from "../server/schema/ListingValidateSchema";

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
