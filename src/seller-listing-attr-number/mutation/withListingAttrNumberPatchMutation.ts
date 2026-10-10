import { withListingAttrOfQuery } from "~/listing-attr/query/withListingAttrOfQuery";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { listingAttrNumberPatchFn } from "~/seller-listing-attr-number/fn/listingAttrNumberPatchFn";
import type { ListingAttrNumberPatchSchema } from "~/seller-listing-attr-number/schema/ListingAttrNumberPatchSchema";

export const withListingAttrNumberPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withListingAttrNumberPatchMutation",
	]),
	keysFn(variables: ListingAttrNumberPatchSchema.Type) {
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
