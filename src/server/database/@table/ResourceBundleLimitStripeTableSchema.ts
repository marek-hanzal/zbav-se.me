import { z } from "zod";

export const ResourceBundleLimitStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a resource bundle limit",
		}),
		resourceBundleLimitId: z.string().meta({
			description: "ID of the resource bundle limit fulfilled from Stripe",
		}),
		key: z.string().meta({
			description: "Deterministic Stripe fulfillment key",
		}),
		createdAt: z.coerce.date().meta({
			description: "Timestamp from the Stripe source object",
			type: "string",
		}),
	})
	.meta({
		id: "ResourceBundleLimitStripeTable",
		description: "Database row for Stripe provenance of a resource bundle limit.",
	})
	.strip();

export type ResourceBundleLimitStripeTableSchema = typeof ResourceBundleLimitStripeTableSchema;

export namespace ResourceBundleLimitStripeTableSchema {
	export type Type = z.infer<ResourceBundleLimitStripeTableSchema>;
}
