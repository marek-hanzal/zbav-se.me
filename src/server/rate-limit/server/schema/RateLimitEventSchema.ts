import { z } from "zod";
import { RateLimitEventTableSchema } from "~/server/database/@table/RateLimitEventTableSchema";

export const RateLimitEventSchema = z
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
		id: "RateLimitEvent",
		description: "Rate limit usage bucket with rule metadata.",
	});

export type RateLimitEventSchema = typeof RateLimitEventSchema;

export namespace RateLimitEventSchema {
	export type Type = z.infer<RateLimitEventSchema>;
}
