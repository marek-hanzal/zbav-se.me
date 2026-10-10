import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrEnumMultiPatchFn } from "~/seller-listing-attr-enum-multi/fn/listingAttrEnumMultiPatchFn";
import type { ListingAttrEnumMultiPatchSchema } from "~/seller-listing-attr-enum-multi/schema/ListingAttrEnumMultiPatchSchema";

export const withListingAttrEnumMultiPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrEnumMultiPatchMutation",
	]),
	keys(variables: ListingAttrEnumMultiPatchSchema.Type) {
		return [
			"listing-attr",
			"enum-multi",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrEnumMultiPatchSchema.Type) {
		return listingAttrEnumMultiPatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
