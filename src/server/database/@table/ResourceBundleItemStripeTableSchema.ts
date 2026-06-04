import { z } from "zod";

export const ResourceBundleItemStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a resource bundle item",
		}),
		resourceBundleItemId: z.string().meta({
			description: "ID of the resource bundle item fulfilled from Stripe",
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
		id: "ResourceBundleItemStripeTable",
		description: "Database row for Stripe provenance of a resource bundle item.",
	})
	.strip();

export type ResourceBundleItemStripeTableSchema = typeof ResourceBundleItemStripeTableSchema;

export namespace ResourceBundleItemStripeTableSchema {
	export type Type = z.infer<ResourceBundleItemStripeTableSchema>;
}
