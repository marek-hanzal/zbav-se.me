import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { listingAttrOfFn } from "../fn/listingAttrOfFn";

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
