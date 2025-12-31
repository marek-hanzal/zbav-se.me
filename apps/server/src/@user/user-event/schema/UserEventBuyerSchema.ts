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
	})
	.strip()
	.openapi("UserEventBuyer", {
		description: "Buyer info for the user event",
	});

export type UserEventBuyerSchema = typeof UserEventBuyerSchema;

export namespace UserEventBuyerSchema {
	export type Type = z.infer<UserEventBuyerSchema>;
}
