import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { listingAttrEnumSinglePatchFn } from "~/seller-listing-attr-enum-single/fn/listingAttrEnumSinglePatchFn";
import type { ListingAttrEnumSinglePatchSchema } from "~/seller-listing-attr-enum-single/schema/ListingAttrEnumSinglePatchSchema";

export const withListingAttrEnumSinglePatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withListingAttrEnumSinglePatchMutation",
	]),
	keysFn(variables: ListingAttrEnumSinglePatchSchema.Type) {
		return [
			"listing-attr",
			"enum-single",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrEnumSinglePatchSchema.Type) {
		return listingAttrEnumSinglePatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
