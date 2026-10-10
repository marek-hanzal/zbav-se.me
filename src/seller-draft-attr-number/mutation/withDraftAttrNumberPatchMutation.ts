import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { draftAttrNumberPatchFn } from "~/seller-draft-attr-number/fn/draftAttrNumberPatchFn";
import type { DraftAttrNumberPatchSchema } from "~/seller-draft-attr-number/schema/DraftAttrNumberPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrNumberPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withDraftAttrNumberPatchMutation",
	]),
	keysFn(variables: DraftAttrNumberPatchSchema.Type) {
		return [
			"draft-attr",
			"number",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrNumberPatchSchema.Type) {
		return draftAttrNumberPatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
