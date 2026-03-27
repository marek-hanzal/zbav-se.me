import { z } from "zod";

export const UserEventBuyerCloserSchema = z
	.looseObject({
		total: z.number().meta({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		closed: z.number().meta({
			description: "Total number of closed transactions",
			example: 0,
		}),
		percent: z.number().meta({
			description: "Percentage of closed transactions (closed / total)",
			example: 0,
		}),
		medianMs: z.number().meta({
			description: "Median milliseconds between transaction creation and closing",
			example: 0,
		}),
		p90Ms: z.number().meta({
			description: "90th percentile milliseconds between transaction creation and closing",
			example: 0,
		}),
	})
	.strip()
	.meta({
		id: "UserEventBuyerCloser",
		description:
			"This metric describes if the user instantly closes transactions (means - no interaction, just open and kill)",
	});

export type UserEventBuyerCloserSchema = typeof UserEventBuyerCloserSchema;

export namespace UserEventBuyerCloserSchema {
	export type Type = z.infer<UserEventBuyerCloserSchema>;
}
