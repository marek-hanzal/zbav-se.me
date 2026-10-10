import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { draftAttrEnumMultiPatchFn } from "~/seller-draft-attr-enum-multi/fn/draftAttrEnumMultiPatchFn";
import type { DraftAttrEnumMultiPatchSchema } from "~/seller-draft-attr-enum-multi/schema/DraftAttrEnumMultiPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrEnumMultiPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrEnumMultiPatchMutation",
	]),
	keys(variables: DraftAttrEnumMultiPatchSchema.Type) {
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
