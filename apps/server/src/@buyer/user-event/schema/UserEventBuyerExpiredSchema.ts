import { z } from "@hono/zod-openapi";

export const UserEventBuyerExpiredSchema = z
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
	});

export type UserEventBuyerExpiredSchema = typeof UserEventBuyerExpiredSchema;

export namespace UserEventBuyerExpiredSchema {
	export type Type = z.infer<UserEventBuyerExpiredSchema>;
}
