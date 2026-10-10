import { z } from "zod";

export const RateLimitEventCreateSchema = z
	.looseObject({
		rule: z.string().meta({
			description: "Name of the rate limit rule",
		}),
		key: z.array(z.string()).meta({
			description: "Key segments used to identify the rate limit bucket",
		}),
	})
	.strip()
	.meta({
		id: "RateLimitEventCreate",
		description: "Data for creating or incrementing a rate limit event bucket",
	});

export type RateLimitEventCreateSchema = typeof RateLimitEventCreateSchema;

export namespace RateLimitEventCreateSchema {
	export type Type = z.infer<RateLimitEventCreateSchema>;
}
