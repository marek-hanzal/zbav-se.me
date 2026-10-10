import { listingAttrOfFn } from "~/listing-attr/fn/listingAttrOfFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";

export namespace withListingAttrOfQuery {
	export interface Data {
		listingId: string;
		categoryId: string;
		nonEmpty: boolean | undefined;
	}
}

export const withListingAttrOfQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withListingAttrOfQuery",
	]),
	errors: {} as {
		query: listingAttrOfFn.Error;
	},
	keysFn(data: withListingAttrOfQuery.Data) {
		return [
			"listing-attr-of",
			data,
		];
	},
	async queryFn(data: withListingAttrOfQuery.Data) {
		return listingAttrOfFn({
			data,
		});
	},
});
