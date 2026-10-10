import { getRootLogger } from "~/log/fn/getRootLogger";
import { withQuery } from "~/query/fn/withQuery";
import { rateLimitFn } from "~/rate-limit/fn/rateLimitFn";
import type { RateLimitQuerySchema } from "~/rate-limit/schema/RateLimitQuerySchema";
import type { RateLimitSchema } from "~/rate-limit/schema/RateLimitSchema";

export const withRateLimitQuery = withQuery({
	logger: getRootLogger([
		"query",
		"withRateLimitQuery",
	]),
	errors: {} as {
		query: rateLimitFn.Error;
	},
	keys(data: RateLimitQuerySchema.Type) {
		return [
			"rate-limit",
			data,
		];
	},
	async queryFn(data: RateLimitQuerySchema.Type): Promise<RateLimitSchema.Type> {
		return rateLimitFn({
			data,
		});
	},
});
