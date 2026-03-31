import { z } from "zod";

export const UserEventSellerReactionSchema = z
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
			description: "Median milliseconds between transaction creation and reaction",
			example: 0,
		}),
		p90Ms: z.number().meta({
			description: "90th percentile milliseconds between transaction creation and reaction",
			example: 0,
		}),
	})
	.strip()
	.meta({
		id: "UserEventSellerReaction",
		description: "Initial reaction by seller on transaction created by buyer.",
	});

export type UserEventSellerReactionSchema = typeof UserEventSellerReactionSchema;

export namespace UserEventSellerReactionSchema {
	export type Type = z.infer<typeof UserEventSellerReactionSchema>;
}
