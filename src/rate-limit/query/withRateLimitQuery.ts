import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { withQueryFn } from "~/query/fn/withQueryFn";
import { rateLimitFn } from "~/rate-limit/fn/rateLimitFn";
import type { RateLimitQuerySchema } from "~/rate-limit/schema/RateLimitQuerySchema";
import type { RateLimitSchema } from "~/rate-limit/schema/RateLimitSchema";

export const withRateLimitQuery = withQueryFn({
	logger: getRootLoggerFn([
		"query",
		"withRateLimitQuery",
	]),
	errors: {} as {
		query: rateLimitFn.Error;
	},
	keysFn(data: RateLimitQuerySchema.Type) {
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
