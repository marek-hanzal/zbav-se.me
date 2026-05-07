import { z } from "zod";

export const UserEventSellerExpiredSchema = z
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
		id: "UserEventSellerExpired",
		description:
			"This metric describes if the user is used to expire transactions (no user's messages)",
	});

export type UserEventSellerExpiredSchema = typeof UserEventSellerExpiredSchema;

export namespace UserEventSellerExpiredSchema {
	export type Type = z.infer<typeof UserEventSellerExpiredSchema>;
}
