import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrTextPatchFn } from "~/seller-listing-attr-text/fn/listingAttrTextPatchFn";
import type { ListingAttrTextPatchSchema } from "~/seller-listing-attr-text/schema/ListingAttrTextPatchSchema";

export const withListingAttrTextPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrTextPatchMutation",
	]),
	keys(variables: ListingAttrTextPatchSchema.Type) {
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
