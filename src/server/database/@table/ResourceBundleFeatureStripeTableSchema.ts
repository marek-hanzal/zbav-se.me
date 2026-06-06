import { z } from "zod";

export const ResourceBundleFeatureStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a resource bundle feature",
		}),
		resourceBundleFeatureId: z.string().meta({
			description: "ID of the resource bundle feature copied from Stripe",
		}),
		key: z.string().meta({
			description: "Deterministic Stripe bundle key",
		}),
		createdAt: z.coerce.date().meta({
			description: "Timestamp from the Stripe source object",
			type: "string",
		}),
	})
	.meta({
		id: "ResourceBundleFeatureStripeTable",
		description: "Database row for Stripe provenance of a resource bundle feature.",
	})
	.strip();

export type ResourceBundleFeatureStripeTableSchema = typeof ResourceBundleFeatureStripeTableSchema;

export namespace ResourceBundleFeatureStripeTableSchema {
	export type Type = z.infer<ResourceBundleFeatureStripeTableSchema>;
}
