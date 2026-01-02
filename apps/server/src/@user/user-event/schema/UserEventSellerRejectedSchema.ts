import { z } from "@hono/zod-openapi";

export const UserEventSellerRejectedSchema = z
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
			description: "90th percentile milliseconds between transaction creation and closing",
			example: 0,
		}),
	})
	.strip()
	.openapi("UserEventSellerRejected", {
		description:
			"This metric describes if the user instantly closes transactions (means - no interaction, just open and kill)",
	});

export type UserEventSellerRejectedSchema = typeof UserEventSellerRejectedSchema;

export namespace UserEventSellerRejectedSchema {
	export type Type = z.infer<UserEventSellerRejectedSchema>;
}
