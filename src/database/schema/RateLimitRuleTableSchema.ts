import { z } from "zod";

export const RateLimitRuleTableSchema = z
	.looseObject({
		name: z.string().meta({
			description: "Unique name of the rate limit rule",
		}),
		window: z.number().int().meta({
			description: "Rate limit window length in seconds",
		}),
		limit: z.coerce.number().meta({
			description: "Maximum allowed count within the rate limit window",
			type: "number",
		}),
	})
	.meta({
		id: "RateLimitRuleTable",
		description: "Database row for a rate limit rule.",
	})
	.strip();

export type RateLimitRuleTableSchema = typeof RateLimitRuleTableSchema;

export namespace RateLimitRuleTableSchema {
	export type Type = z.infer<RateLimitRuleTableSchema>;
}
