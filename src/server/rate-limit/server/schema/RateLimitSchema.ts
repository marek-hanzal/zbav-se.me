import { z } from "zod";
import { RateLimitEventTableSchema } from "~/server/database/@table/RateLimitEventTableSchema";

export const RateLimitSchema = z
	.looseObject({
		...RateLimitEventTableSchema.shape,
		limit: z.coerce.number().meta({
			description: "Maximum allowed count within the rate limit window",
			type: "number",
		}),
		seconds: z.number().int().meta({
			description: "Rate limit window length in seconds",
		}),
	})
	.strip()
	.meta({
		id: "RateLimit",
		description: "Current snapshot of a rate limit bucket with rule metadata.",
	});

export type RateLimitSchema = typeof RateLimitSchema;

export namespace RateLimitSchema {
	export type Type = z.infer<RateLimitSchema>;
}
