import { withListingAttrOfQuery } from "~/common/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrTextPatchFn } from "../fn/listingAttrTextPatchFn";
import type { ListingAttrTextPatchSchema } from "../server/schema/ListingAttrTextPatchSchema";

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
