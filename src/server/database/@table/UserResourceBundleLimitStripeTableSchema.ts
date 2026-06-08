import { z } from "zod";

export const UserResourceBundleLimitStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the Stripe mapping for a user resource limit",
		}),
		userResourceBundleLimitId: z.string().meta({
			description: "ID of the user resource limit copied from Stripe",
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
		id: "UserResourceBundleLimitStripeTable",
		description: "Database row for Stripe provenance of a user resource limit.",
	})
	.strip();

export type UserResourceBundleLimitStripeTableSchema =
	typeof UserResourceBundleLimitStripeTableSchema;

export namespace UserResourceBundleLimitStripeTableSchema {
	export type Type = z.infer<UserResourceBundleLimitStripeTableSchema>;
}
