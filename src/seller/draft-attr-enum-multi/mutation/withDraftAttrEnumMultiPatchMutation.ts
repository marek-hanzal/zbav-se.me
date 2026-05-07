import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { draftAttrEnumMultiPatchFn } from "../fn/draftAttrEnumMultiPatchFn";
import type { DraftAttrEnumMultiPatchSchema } from "../server/schema/DraftAttrEnumMultiPatchSchema";

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
