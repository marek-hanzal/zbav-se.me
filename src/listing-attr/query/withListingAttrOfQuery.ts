import { listingAttrOfFn } from "~/listing-attr/fn/listingAttrOfFn";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";

export namespace withListingAttrOfQuery {
	export interface Data {
		listingId: string;
		categoryId: string;
		nonEmpty: boolean | undefined;
	}
}

export const withListingAttrOfQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withListingAttrOfQuery",
	]),
	errors: {} as {
		query: listingAttrOfFn.Error;
	},
	keys(data: withListingAttrOfQuery.Data) {
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
