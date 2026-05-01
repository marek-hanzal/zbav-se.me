import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { attrDecimalPatchFn } from "../fn/attrDecimalPatchFn";
import type { AttrDecimalPatchSchema } from "../server/schema/AttrDecimalPatchSchema";

export const withAttrDecimalPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withAttrDecimalPatchMutation",
	]),
	keys(variables: AttrDecimalPatchSchema.Type) {
		return [
			"attr",
			"decimal",
			"patch",
			variables,
		];
	},
	async mutationFn(data: AttrDecimalPatchSchema.Type) {
		return attrDecimalPatchFn({
			data,
		});
	},
	invalidate: [
		withAttrOfQuery,
	],
});
