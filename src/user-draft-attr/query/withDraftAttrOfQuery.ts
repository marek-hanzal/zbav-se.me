import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { draftAttrOfFn } from "~/user-draft-attr/fn/draftAttrOfFn";

export namespace withDraftAttrOfQuery {
	export interface Data {
		draftId: string;
		categoryId: string;
	}
}

export const withDraftAttrOfQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withDraftAttrOfQuery",
	]),
	errors: {} as {
		query: draftAttrOfFn.Error;
	},
	keys(data: withDraftAttrOfQuery.Data) {
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
