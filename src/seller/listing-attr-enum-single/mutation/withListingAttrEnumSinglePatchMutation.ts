import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withListingAttrOfQuery } from "~/user/listing-attr/query/withListingAttrOfQuery";
import { listingAttrEnumSinglePatchFn } from "../fn/listingAttrEnumSinglePatchFn";
import type { ListingAttrEnumSinglePatchSchema } from "../server/schema/ListingAttrEnumSinglePatchSchema";

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
