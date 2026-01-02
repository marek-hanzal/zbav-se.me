import { z } from "@hono/zod-openapi";

export const UserEventBuyerSchema = z
	.looseObject({
		reaction: z
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
					description:
						"90th percentile milliseconds between transaction opening and reaction",
					example: 0,
				}),
			})
			.strip()
			.openapi("UserEventBuyerReaction", {
				description: "Initial reaction on opened transaction by seller.",
			}),
		closer: z
			.looseObject({
				total: z.number().openapi({
					description: "Total number of samples (transactions)",
					example: 0,
				}),
				closed: z.number().openapi({
					description: "Total number of closed transactions",
					example: 0,
				}),
				percent: z.number().openapi({
					description: "Percentage of closed transactions (closed / total)",
					example: 0,
				}),
				medianMs: z.number().openapi({
					description: "Median milliseconds between transaction creation and closing",
					example: 0,
				}),
				p90Ms: z.number().openapi({
					description:
						"90th percentile milliseconds between transaction creation and closing",
					example: 0,
				}),
			})
			.strip()
			.openapi("UserEventBuyerCloser", {
				description:
					"This metric describes if the user instantly closes transactions (means - no interaction, just open and kill)",
			}),
		decision: z
			.looseObject({
				total: z.number().openapi({
					description: "Total number of samples (transactions)",
					example: 0,
				}),
				decisions: z.number().openapi({
					description: "Total number of decisions (success, closed)",
					example: 0,
				}),
				terminal: z.number().openapi({
					description: "Total number of terminal decisions (usually from the other side)",
					example: 0,
				}),
				percent: z.number().openapi({
					description: "Percentage of closed transactions (closed / total)",
					example: 0,
				}),
			})
			.strip()
			.openapi("UserEventBuyerDecision", {
				description:
					"This metric describes if the user is used to close/success transactions",
			}),
		expired: z
			.looseObject({
				total: z.number().openapi({
					description: "Total number of samples (transactions)",
					example: 0,
				}),
				expired: z.number().openapi({
					description: "Total number of expired transactions",
					example: 0,
				}),
				percent: z.number().openapi({
					description: "Percentage of expired transactions (expired / total)",
					example: 0,
				}),
			})
			.strip()
			.openapi("UserEventBuyerExpired", {
				description:
					"This metric describes if the user is used to expire transactions (no user's messages)",
			}),
		load: z
			.looseObject({
				bucket: z
					.enum([
						"low",
						"medium",
						"high",
					])
					.openapi({
						description: "Load type of the buyer",
						example: "low",
					}),
			})
			.strip()
			.openapi("UserEventBuyerLoad", {
				description:
					"Masks number of transactions of the buyer, basically it tells, how busy buyer is.",
			}),
		activity: z
			.looseObject({
				bucket: z
					.enum([
						"low",
						"medium",
						"high",
					])
					.openapi({
						description: "Activity type of the buyer",
						example: "low",
					}),
			})
			.strip()
			.openapi("UserEventBuyerActivity", {
				description: "This metric describes the approx activity of the user",
			}),
	})
	.strip()
	.openapi("UserEventBuyer", {
		description: "Buyer info for the user event",
	});

export type UserEventBuyerSchema = typeof UserEventBuyerSchema;

export namespace UserEventBuyerSchema {
	export type Type = z.infer<UserEventBuyerSchema>;
}
