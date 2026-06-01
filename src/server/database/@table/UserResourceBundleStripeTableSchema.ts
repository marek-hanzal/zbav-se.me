import { z } from "zod";

export const UserResourceBundleStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user resource bundle Stripe mapping",
		}),
		userResourceBundleId: z.string().meta({
			description: "ID of the mapped user resource bundle",
		}),
		subscriptionId: z.string().meta({
			description: "Stripe subscription ID mapped to the user resource bundle",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleStripeTable",
		description: "Database row for a Stripe mapping of a user resource bundle.",
	})
	.strip();

export type UserResourceBundleStripeTableSchema = typeof UserResourceBundleStripeTableSchema;

export namespace UserResourceBundleStripeTableSchema {
	export type Type = z.infer<UserResourceBundleStripeTableSchema>;
}
