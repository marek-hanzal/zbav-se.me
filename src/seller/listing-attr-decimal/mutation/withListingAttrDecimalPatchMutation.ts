import { withMutation } from "@/lib/client/mutation";
import { withListingAttrOfQuery } from "~/common/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingAttrDecimalPatchFn } from "../fn/listingAttrDecimalPatchFn";
import type { ListingAttrDecimalPatchSchema } from "../server/schema/ListingAttrDecimalPatchSchema";

export const withListingAttrDecimalPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withListingAttrDecimalPatchMutation",
	]),
	keys(variables: ListingAttrDecimalPatchSchema.Type) {
		return [
			"listing-attr",
			"decimal",
			"patch",
			variables,
		];
	},
	async mutationFn(data: ListingAttrDecimalPatchSchema.Type) {
		return listingAttrDecimalPatchFn({
			data,
		});
	},
	invalidate: [
		withListingAttrOfQuery,
	],
});
