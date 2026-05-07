import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { draftAttrTextPatchFn } from "../fn/draftAttrTextPatchFn";
import type { DraftAttrTextPatchSchema } from "../server/schema/DraftAttrTextPatchSchema";

export const withDraftAttrTextPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withDraftAttrTextPatchMutation",
	]),
	keys(variables: DraftAttrTextPatchSchema.Type) {
		return [
			"draft-attr",
			"text",
			"patch",
			variables,
		];
	},
	async mutationFn(data: DraftAttrTextPatchSchema.Type) {
		return draftAttrTextPatchFn({
			data,
		});
	},
	invalidate: [
		withDraftAttrOfQuery,
	],
});
