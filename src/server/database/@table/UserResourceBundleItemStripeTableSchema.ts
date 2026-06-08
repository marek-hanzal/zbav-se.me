import { z } from "zod";

export const UserResourceBundleItemStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a user resource item",
		}),
		userResourceBundleItemId: z.string().meta({
			description: "ID of the user resource item copied from Stripe",
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
		id: "UserResourceBundleItemStripeTable",
		description: "Database row for Stripe provenance of a user resource item.",
	})
	.strip();

export type UserResourceBundleItemStripeTableSchema =
	typeof UserResourceBundleItemStripeTableSchema;

export namespace UserResourceBundleItemStripeTableSchema {
	export type Type = z.infer<UserResourceBundleItemStripeTableSchema>;
}
