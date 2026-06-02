import { z } from "zod";

export const ResourceBundleStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the resource bundle Stripe mapping",
		}),
		resourceBundleId: z.string().meta({
			description: "ID of the mapped resource bundle",
		}),
		priceId: z.string().meta({
			description: "Stripe price ID mapped to the resource bundle",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "ResourceBundleStripeTable",
		description: "Database row for a Stripe mapping of a resource bundle.",
	})
	.strip();

export type ResourceBundleStripeTableSchema = typeof ResourceBundleStripeTableSchema;

export namespace ResourceBundleStripeTableSchema {
	export type Type = z.infer<ResourceBundleStripeTableSchema>;
}
