import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { draftAttrDecimalPatchFn } from "../fn/draftAttrDecimalPatchFn";
import type { DraftAttrDecimalPatchSchema } from "../server/schema/DraftAttrDecimalPatchSchema";

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
