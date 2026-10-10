import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { draftAttrOfFn } from "~/user-draft-attr/fn/draftAttrOfFn";

export namespace withDraftAttrOfQuery {
	export interface Data {
		draftId: string;
		categoryId: string;
	}
}

export const withDraftAttrOfQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withDraftAttrOfQuery",
	]),
	errors: {} as {
		query: draftAttrOfFn.Error;
	},
	keysFn(data: withDraftAttrOfQuery.Data) {
		return [
			"draft-attr-of",
			data,
		];
	},
	async queryFn(data: withDraftAttrOfQuery.Data) {
		return draftAttrOfFn({
			data,
		});
	},
});
