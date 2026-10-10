import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrNumberPatchFn } from "~/seller-listing-attr-number/fn/listingAttrNumberPatchFn";
import type { ListingAttrNumberPatchSchema } from "~/seller-listing-attr-number/schema/ListingAttrNumberPatchSchema";

export const withListingAttrNumberPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrNumberPatchMutation",
	]),
	keys(variables: ListingAttrNumberPatchSchema.Type) {
		return [
			"listing-attr",
			"number",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrNumberPatchSchema.Type) {
		return listingAttrNumberPatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
