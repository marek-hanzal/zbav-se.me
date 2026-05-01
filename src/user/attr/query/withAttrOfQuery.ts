import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { attrOfFn } from "../fn/attrOfFn";

export namespace withAttrOfQuery {
	export interface Data {
		listingId: string;
		categoryId: string;
	}
}

export const withAttrOfQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withAttrOfQuery",
	]),
	errors: {} as {
		query: attrOfFn.Error;
	},
	keys(data: withAttrOfQuery.Data) {
		return [
			"attr-of",
			data,
		];
	},
	async queryFn(data: withAttrOfQuery.Data) {
		return attrOfFn({
			data,
		});
	},
});
