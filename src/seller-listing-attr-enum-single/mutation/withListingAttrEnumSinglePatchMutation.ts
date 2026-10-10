import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrEnumSinglePatchFn } from "~/seller-listing-attr-enum-single/fn/listingAttrEnumSinglePatchFn";
import type { ListingAttrEnumSinglePatchSchema } from "~/seller-listing-attr-enum-single/schema/ListingAttrEnumSinglePatchSchema";

export const withListingAttrEnumSinglePatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrEnumSinglePatchMutation",
	]),
	keys(variables: ListingAttrEnumSinglePatchSchema.Type) {
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
