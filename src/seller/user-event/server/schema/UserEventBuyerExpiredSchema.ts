import { z } from "zod";

export const UserEventBuyerExpiredSchema = z
	.looseObject({
		total: z.number().meta({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		expired: z.number().meta({
			description: "Total number of expired transactions",
			example: 0,
		}),
		percent: z.number().meta({
			description: "Percentage of expired transactions (expired / total)",
			example: 0,
		}),
	})
	.strip()
	.meta({
		id: "UserEventBuyerExpired",
		description:
			"This metric describes if the user is used to expire transactions (no user's messages)",
	});

export type UserEventBuyerExpiredSchema = typeof UserEventBuyerExpiredSchema;

export namespace UserEventBuyerExpiredSchema {
	export type Type = z.infer<UserEventBuyerExpiredSchema>;
}
