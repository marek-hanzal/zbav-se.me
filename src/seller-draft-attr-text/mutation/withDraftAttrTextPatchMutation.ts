import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { draftAttrTextPatchFn } from "~/seller-draft-attr-text/fn/draftAttrTextPatchFn";
import type { DraftAttrTextPatchSchema } from "~/seller-draft-attr-text/schema/DraftAttrTextPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrTextPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withDraftAttrTextPatchMutation",
	]),
	keysFn(variables: DraftAttrTextPatchSchema.Type) {
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
