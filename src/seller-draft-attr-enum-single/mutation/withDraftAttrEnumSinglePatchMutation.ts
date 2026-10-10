import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { draftAttrEnumSinglePatchFn } from "~/seller-draft-attr-enum-single/fn/draftAttrEnumSinglePatchFn";
import type { DraftAttrEnumSinglePatchSchema } from "~/seller-draft-attr-enum-single/schema/DraftAttrEnumSinglePatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrEnumSinglePatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrEnumSinglePatchMutation",
	]),
	keys(variables: DraftAttrEnumSinglePatchSchema.Type) {
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
