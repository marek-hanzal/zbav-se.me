import { withMutation } from "@/lib/client/mutation";
import { withListingAttrOfQuery } from "~/common/listing-attr/query/withListingAttrOfQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingAttrNumberPatchFn } from "../fn/listingAttrNumberPatchFn";
import type { ListingAttrNumberPatchSchema } from "../server/schema/ListingAttrNumberPatchSchema";

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
