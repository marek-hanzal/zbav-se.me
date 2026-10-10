import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withMutationFn } from "~/mutation/fn/withMutationFn";
import { draftAttrEnumMultiPatchFn } from "~/seller-draft-attr-enum-multi/fn/draftAttrEnumMultiPatchFn";
import type { DraftAttrEnumMultiPatchSchema } from "~/seller-draft-attr-enum-multi/schema/DraftAttrEnumMultiPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrEnumMultiPatchMutation = withMutationFn({
	logger: getRootLoggerFn([
		"mutation",
		"withDraftAttrEnumMultiPatchMutation",
	]),
	keysFn(variables: DraftAttrEnumMultiPatchSchema.Type) {
		return [
			"draft-attr",
			"enum-multi",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrEnumMultiPatchSchema.Type) {
		return draftAttrEnumMultiPatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
