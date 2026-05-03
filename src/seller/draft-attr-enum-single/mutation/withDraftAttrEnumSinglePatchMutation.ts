import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { draftAttrEnumSinglePatchFn } from "../fn/draftAttrEnumSinglePatchFn";
import type { DraftAttrEnumSinglePatchSchema } from "../server/schema/DraftAttrEnumSinglePatchSchema";

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
