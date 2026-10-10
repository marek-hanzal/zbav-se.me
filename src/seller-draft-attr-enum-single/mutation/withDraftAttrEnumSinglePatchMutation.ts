import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { draftAttrEnumSinglePatchFn } from "~/seller-draft-attr-enum-single/fn/draftAttrEnumSinglePatchFn";
import type { DraftAttrEnumSinglePatchSchema } from "~/seller-draft-attr-enum-single/schema/DraftAttrEnumSinglePatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrEnumSinglePatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withDraftAttrEnumSinglePatchMutation",
	]),
	keysFn(variables: DraftAttrEnumSinglePatchSchema.Type) {
		return [
			"draft-attr",
			"enum-single",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrEnumSinglePatchSchema.Type) {
		return draftAttrEnumSinglePatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
