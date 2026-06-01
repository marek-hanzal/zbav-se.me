import { z } from "zod";

export const UserStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user Stripe mapping",
		}),
		userId: z.string().meta({
			description: "ID of the mapped user",
		}),
		customerId: z.string().meta({
			description: "Stripe customer ID mapped to the user",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "UserStripeTable",
		description: "Database row for a Stripe mapping of a user.",
	})
	.strip();

export type UserStripeTableSchema = typeof UserStripeTableSchema;

export namespace UserStripeTableSchema {
	export type Type = z.infer<UserStripeTableSchema>;
}
