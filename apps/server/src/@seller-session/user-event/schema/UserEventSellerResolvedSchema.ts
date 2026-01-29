import { z } from "@hono/zod-openapi";

export const UserEventSellerResolvedSchema = z
	.looseObject({
		total: z.number().openapi({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		resolved: z.number().openapi({
			description: "Total number of resolved transactions (success, closed)",
			example: 0,
		}),
		terminal: z.number().openapi({
			description: "Total number of terminal transactions (usually from the other side)",
			example: 0,
		}),
		percent: z.number().openapi({
			description: "Percentage of resolved transactions (resolved / total)",
			example: 0,
		}),
		medianMs: z.number().openapi({
			description: "Median milliseconds until the transaction gets resolved",
			example: 0,
		}),
		p90Ms: z.number().openapi({
			description: "90th percentile milliseconds until the transaction gets resolved",
			example: 0,
		}),
	})
	.strip()
	.openapi("UserEventSellerResolved", {
		description: "This metric describes if the user resolves transactions (success/closed)",
	});

export type UserEventSellerResolvedSchema = typeof UserEventSellerResolvedSchema;

export namespace UserEventSellerResolvedSchema {
	export type Type = z.infer<UserEventSellerResolvedSchema>;
}
