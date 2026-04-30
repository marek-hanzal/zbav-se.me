import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { attrTextPatchFn } from "../fn/attrTextPatchFn";
import type { AttrTextPatchSchema } from "../server/schema/AttrTextPatchSchema";

export const withAttrTextPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withAttrTextPatchMutation",
	]),
	keys(variables: AttrTextPatchSchema.Type) {
		return [
			"attr",
			"text",
			"patch",
			variables,
		];
	},
	async mutationFn(data: AttrTextPatchSchema.Type) {
		return attrTextPatchFn({
			data,
		});
	},
	invalidate: [
		withAttrOfQuery,
	],
});
