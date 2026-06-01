import { z } from "zod";

export const PlanStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the plan Stripe mapping",
		}),
		planId: z.string().meta({
			description: "ID of the mapped monetization plan",
		}),
		priceId: z.string().meta({
			description: "Stripe price ID mapped to the plan",
		}),
		url: z.string().nullable().meta({
			description: "Optional Stripe checkout or payment link URL",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "PlanStripeTable",
		description: "Database row for a Stripe mapping of a monetization plan.",
	})
	.strip();

export type PlanStripeTableSchema = typeof PlanStripeTableSchema;

export namespace PlanStripeTableSchema {
	export type Type = z.infer<PlanStripeTableSchema>;
}
