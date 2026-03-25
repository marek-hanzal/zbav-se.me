import { z } from "@hono/zod-openapi";

export const UserEventBuyerReactionSchema = z
	.looseObject({
		total: z.number().openapi({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		reactions: z.number().openapi({
			description: "Total number of reactions",
			example: 0,
		}),
		terminal: z.number().openapi({
			description: "Total number of terminal reactions (usually from the other side)",
			example: 0,
		}),
		percent: z.number().openapi({
			description: "Percentage of reactions (reactions + terminal) / total",
			example: 0,
		}),
		medianMs: z.number().openapi({
			description: "Median milliseconds between transaction opening and reaction",
			example: 0,
		}),
		p90Ms: z.number().openapi({
			description: "90th percentile milliseconds between transaction opening and reaction",
			example: 0,
		}),
	})
	.strip()
	.openapi("UserEventBuyerReaction", {
		description: "Initial reaction on opened transaction by seller.",
	});

export type UserEventBuyerReactionSchema = typeof UserEventBuyerReactionSchema;

export namespace UserEventBuyerReactionSchema {
	export type Type = z.infer<UserEventBuyerReactionSchema>;
}
