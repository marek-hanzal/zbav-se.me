import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrDecimalPatchFn } from "~/seller-listing-attr-decimal/fn/listingAttrDecimalPatchFn";
import type { ListingAttrDecimalPatchSchema } from "~/seller-listing-attr-decimal/schema/ListingAttrDecimalPatchSchema";

export const withListingAttrDecimalPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrDecimalPatchMutation",
	]),
	keys(variables: ListingAttrDecimalPatchSchema.Type) {
		return [
			"listing-attr",
			"decimal",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrDecimalPatchSchema.Type) {
		return listingAttrDecimalPatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
