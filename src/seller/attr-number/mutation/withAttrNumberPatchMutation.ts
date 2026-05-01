import { withMutation } from "@/lib/client/mutation";
import { getRootLogger } from "~/common/log/getRootLogger";
import { withAttrOfQuery } from "~/user/attr/query/withAttrOfQuery";
import { attrNumberPatchFn } from "../fn/attrNumberPatchFn";
import type { AttrNumberPatchSchema } from "../server/schema/AttrNumberPatchSchema";

export const withAttrNumberPatchMutation = withMutation({
	logger: getRootLogger([
		"mutation",
		"withAttrNumberPatchMutation",
	]),
	keys(variables: AttrNumberPatchSchema.Type) {
		return [
			"attr",
			"number",
			"patch",
			variables,
		];
	},
	async mutationFn(data: AttrNumberPatchSchema.Type) {
		return attrNumberPatchFn({
			data,
		});
	},
	invalidate: [
		withAttrOfQuery,
	],
});
