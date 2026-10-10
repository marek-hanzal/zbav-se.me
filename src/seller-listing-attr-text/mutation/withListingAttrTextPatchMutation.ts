import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { listingAttrTextPatchFn } from "~/seller-listing-attr-text/fn/listingAttrTextPatchFn";
import type { ListingAttrTextPatchSchema } from "~/seller-listing-attr-text/schema/ListingAttrTextPatchSchema";

export const withListingAttrTextPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withListingAttrTextPatchMutation",
	]),
	keysFn(variables: ListingAttrTextPatchSchema.Type) {
		return [
			"listing-attr",
			"text",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrTextPatchSchema.Type) {
		return listingAttrTextPatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
