import { z } from "zod";

export const UserEventBuyerReactionSchema = z
	.looseObject({
		total: z.number().meta({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		reactions: z.number().meta({
			description: "Total number of reactions",
			example: 0,
		}),
		terminal: z.number().meta({
			description: "Total number of terminal reactions (usually from the other side)",
			example: 0,
		}),
		percent: z.number().meta({
			description: "Percentage of reactions (reactions + terminal) / total",
			example: 0,
		}),
		medianMs: z.number().meta({
			description: "Median milliseconds between transaction opening and reaction",
			example: 0,
		}),
		p90Ms: z.number().meta({
			description: "90th percentile milliseconds between transaction opening and reaction",
			example: 0,
		}),
	})
	.strip()
	.meta({
		id: "UserEventBuyerReaction",
		description: "Initial reaction on opened transaction by seller.",
	});

export type UserEventBuyerReactionSchema = typeof UserEventBuyerReactionSchema;

export namespace UserEventBuyerReactionSchema {
	export type Type = z.infer<UserEventBuyerReactionSchema>;
}
