import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { attrEnumMultiPatchFn } from "../fn/attrEnumMultiPatchFn";
import type { AttrEnumMultiPatchSchema } from "../server/schema/AttrEnumMultiPatchSchema";

export const withAttrEnumMultiPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withAttrEnumMultiPatchMutation",
	]),
	keys(variables: AttrEnumMultiPatchSchema.Type) {
		return [
			"attr",
			"enum-multi",
			"patch",
			variables,
		];
	},
	async mutationFn(data: AttrEnumMultiPatchSchema.Type) {
		return attrEnumMultiPatchFn({
			data,
		});
	},
	invalidate: [
		withAttrOfQuery,
	],
});
