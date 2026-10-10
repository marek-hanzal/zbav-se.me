import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { draftAttrTextPatchFn } from "~/seller-draft-attr-text/fn/draftAttrTextPatchFn";
import type { DraftAttrTextPatchSchema } from "~/seller-draft-attr-text/schema/DraftAttrTextPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrTextPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrTextPatchMutation",
	]),
	keys(variables: DraftAttrTextPatchSchema.Type) {
		return [
			"draft-attr",
			"text",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrTextPatchSchema.Type) {
		return draftAttrTextPatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
