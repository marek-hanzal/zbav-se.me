import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { resourceLimitCheckFn } from "~/user-resource-limit/fn/resourceLimitCheckFn";
import type { ResourceLimitCheckSchema } from "~/user-resource-limit/schema/ResourceLimitCheckSchema";

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
