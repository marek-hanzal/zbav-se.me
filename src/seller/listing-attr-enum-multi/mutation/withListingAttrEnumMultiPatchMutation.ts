import { withListingAttrOfQuery } from "~/common/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { listingAttrEnumMultiPatchFn } from "../fn/listingAttrEnumMultiPatchFn";
import type { ListingAttrEnumMultiPatchSchema } from "../server/schema/ListingAttrEnumMultiPatchSchema";

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
