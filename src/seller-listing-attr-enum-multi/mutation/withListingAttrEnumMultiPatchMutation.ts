import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { listingAttrEnumMultiPatchFn } from "~/seller-listing-attr-enum-multi/fn/listingAttrEnumMultiPatchFn";
import type { ListingAttrEnumMultiPatchSchema } from "~/seller-listing-attr-enum-multi/schema/ListingAttrEnumMultiPatchSchema";

export const withListingAttrEnumMultiPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withListingAttrEnumMultiPatchMutation",
	]),
	keysFn(variables: ListingAttrEnumMultiPatchSchema.Type) {
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
