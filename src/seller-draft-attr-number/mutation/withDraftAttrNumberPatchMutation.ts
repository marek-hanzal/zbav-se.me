import { getRootLogger } from "~/log/fn/getRootLogger";
import { withMutation } from "~/mutation/fn/withMutation";
import { draftAttrNumberPatchFn } from "~/seller-draft-attr-number/fn/draftAttrNumberPatchFn";
import type { DraftAttrNumberPatchSchema } from "~/seller-draft-attr-number/schema/DraftAttrNumberPatchSchema";
import { withDraftAttrOfQuery } from "~/user-draft-attr/query/withDraftAttrOfQuery";

export const withDraftAttrNumberPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrNumberPatchMutation",
	]),
	keys(variables: DraftAttrNumberPatchSchema.Type) {
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
