import { withQuery } from "@/lib/client/query";
import { getRootLogger } from "~/common/log/getRootLogger";
import { rateLimitFn } from "~/server/rate-limit/fn/rateLimitFn";
import type { RateLimitQuerySchema } from "~/server/rate-limit/server/schema/RateLimitQuerySchema";
import type { RateLimitSchema } from "~/server/rate-limit/server/schema/RateLimitSchema";

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
