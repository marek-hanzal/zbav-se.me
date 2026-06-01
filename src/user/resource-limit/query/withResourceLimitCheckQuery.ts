import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { resourceLimitCheckFn } from "../fn/resourceLimitCheckFn";
import type { ResourceLimitCheckSchema } from "../server/schema/ResourceLimitCheckSchema";

export const withResourceLimitCheckQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withResourceLimitCheckQuery",
	]),
	errors: {} as {
		query: resourceLimitCheckFn.Error;
	},
	keys() {
		return [
			"resource",
			"limit",
		];
	},
	queryFn(data: ResourceLimitCheckSchema.Type) {
		return resourceLimitCheckFn({
			data,
		});
	},
});
