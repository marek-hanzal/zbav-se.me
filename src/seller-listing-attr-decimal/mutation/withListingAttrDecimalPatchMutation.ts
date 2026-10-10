import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { listingAttrDecimalPatchFn } from "~/seller-listing-attr-decimal/fn/listingAttrDecimalPatchFn";
import type { ListingAttrDecimalPatchSchema } from "~/seller-listing-attr-decimal/schema/ListingAttrDecimalPatchSchema";

export const withListingAttrDecimalPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withListingAttrDecimalPatchMutation",
	]),
	keysFn(variables: ListingAttrDecimalPatchSchema.Type) {
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
