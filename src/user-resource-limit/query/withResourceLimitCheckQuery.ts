import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { resourceLimitCheckFn } from "~/user-resource-limit/fn/resourceLimitCheckFn";
import type { ResourceLimitCheckSchema } from "~/user-resource-limit/schema/ResourceLimitCheckSchema";

export const withResourceLimitCheckQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withResourceLimitCheckQuery",
	]),
	errors: {} as {
		query: resourceLimitCheckFn.Error;
	},
	keysFn() {
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
