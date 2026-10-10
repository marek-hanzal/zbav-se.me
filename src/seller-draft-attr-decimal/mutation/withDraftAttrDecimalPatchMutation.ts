import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { draftAttrDecimalPatchFn } from "~/seller-draft-attr-decimal/fn/draftAttrDecimalPatchFn";
import type { DraftAttrDecimalPatchSchema } from "~/seller-draft-attr-decimal/schema/DraftAttrDecimalPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrDecimalPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrDecimalPatchMutation",
	]),
	keys(variables: DraftAttrDecimalPatchSchema.Type) {
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
