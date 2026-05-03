import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withDraftAttrOfQuery } from "~/user/draft-attr/query/withDraftAttrOfQuery";
import { draftAttrNumberPatchFn } from "../fn/draftAttrNumberPatchFn";
import type { DraftAttrNumberPatchSchema } from "../server/schema/DraftAttrNumberPatchSchema";

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
