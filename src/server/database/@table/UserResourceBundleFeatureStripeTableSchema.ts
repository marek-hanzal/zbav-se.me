import { z } from "zod";

export const UserResourceBundleFeatureStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a user resource feature",
		}),
		userResourceBundleFeatureId: z.string().meta({
			description: "ID of the user resource feature copied from Stripe",
		}),
		key: z.string().meta({
			description: "Deterministic Stripe source key",
		}),
		createdAt: z.coerce.date().meta({
			description: "Timestamp from the Stripe source object",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleFeatureStripeTable",
		description: "Database row for Stripe provenance of a user resource feature.",
	})
	.strip();

export type UserResourceBundleFeatureStripeTableSchema =
	typeof UserResourceBundleFeatureStripeTableSchema;

export namespace UserResourceBundleFeatureStripeTableSchema {
	export type Type = z.infer<UserResourceBundleFeatureStripeTableSchema>;
}
