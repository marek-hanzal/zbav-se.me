import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { attrEnumSinglePatchFn } from "../fn/attrEnumSinglePatchFn";
import type { AttrEnumSinglePatchSchema } from "../server/schema/AttrEnumSinglePatchSchema";

export const withAttrEnumSinglePatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withAttrEnumSinglePatchMutation",
	]),
	keys(variables: AttrEnumSinglePatchSchema.Type) {
		return [
			"attr",
			"patch",
			variables,
		];
	},
	async mutationFn(data: AttrEnumSinglePatchSchema.Type) {
		return attrEnumSinglePatchFn({
			data,
		});
	},
	invalidate: [
		withAttrOfQuery,
	],
});
