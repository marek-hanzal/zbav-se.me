import { z } from "zod";

export const RateLimitEventTableSchema = z
	.looseObject({
		rule: z.string().meta({
			description: "Name of the referenced rate limit rule",
		}),
		key: z.string().meta({
			description: "Hashed identifier used to bucket the rate limit event",
		}),
		window: z.coerce.date().meta({
			description: "Start timestamp of the rate limit window",
			type: "string",
		}),
		count: z.number().int().meta({
			description: "Current hit count within the rate limit window",
		}),
	})
	.meta({
		id: "RateLimitEventTable",
		description: "Database row for a rate limit usage bucket.",
	})
	.strip();

export type RateLimitEventTableSchema = typeof RateLimitEventTableSchema;

export namespace RateLimitEventTableSchema {
	export type Type = z.infer<RateLimitEventTableSchema>;
}
