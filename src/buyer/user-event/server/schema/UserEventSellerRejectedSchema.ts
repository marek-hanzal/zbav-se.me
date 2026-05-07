import { z } from "zod";

export const UserEventSellerRejectedSchema = z
	.looseObject({
		total: z.number().meta({
			description: "Total number of samples (transactions)",
			example: 0,
		}),
		rejected: z.number().meta({
			description: "Total number of rejected transactions",
			example: 0,
		}),
		percent: z.number().meta({
			description: "Percentage of rejected transactions (rejected / total)",
			example: 0,
		}),
		medianMs: z.number().meta({
			description: "Median milliseconds between transaction creation and rejection",
			example: 0,
		}),
		p90Ms: z.number().meta({
			description: "90th percentile milliseconds between transaction creation and rejection",
			example: 0,
		}),
	})
	.strip()
	.meta({
		id: "UserEventSellerRejected",
		description:
			"This metric describes if the user rejects transactions without any interaction (no messages between create and reject)",
	});

export type UserEventSellerRejectedSchema = typeof UserEventSellerRejectedSchema;

export namespace UserEventSellerRejectedSchema {
	export type Type = z.infer<typeof UserEventSellerRejectedSchema>;
}
