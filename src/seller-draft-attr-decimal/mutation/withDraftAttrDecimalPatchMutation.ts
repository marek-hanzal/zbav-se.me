import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { draftAttrDecimalPatchFn } from "~/seller-draft-attr-decimal/fn/draftAttrDecimalPatchFn";
import type { DraftAttrDecimalPatchSchema } from "~/seller-draft-attr-decimal/schema/DraftAttrDecimalPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrDecimalPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withDraftAttrDecimalPatchMutation",
	]),
	keysFn(variables: DraftAttrDecimalPatchSchema.Type) {
		return [
			"draft-attr",
			"decimal",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrDecimalPatchSchema.Type) {
		return draftAttrDecimalPatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
