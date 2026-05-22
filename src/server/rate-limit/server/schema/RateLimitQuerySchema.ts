import { z } from "zod";

export const RateLimitQuerySchema = z
	.looseObject({
		rule: z.string().min(1).meta({
			description: "Canonical rate limit rule name",
		}),
		key: z.array(z.string().min(1)).min(1).meta({
			description: "Composite caller key used to resolve the rate limit bucket",
		}),
	})
	.strip()
	.meta({
		id: "RateLimitQuery",
		description: "Query parameters for a rate limit snapshot",
	});

export type RateLimitQuerySchema = typeof RateLimitQuerySchema;

export namespace RateLimitQuerySchema {
	export type Type = z.infer<RateLimitQuerySchema>;
}
