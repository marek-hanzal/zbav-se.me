import { z } from "zod";

export const UserPlanStripeTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user plan Stripe mapping",
		}),
		userPlanId: z.string().meta({
			description: "ID of the mapped user plan",
		}),
		subscriptionId: z.string().meta({
			description: "Stripe subscription ID mapped to the user plan",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
	})
	.meta({
		id: "UserPlanStripeTable",
		description: "Database row for a Stripe mapping of a user plan.",
	})
	.strip();

export type UserPlanStripeTableSchema = typeof UserPlanStripeTableSchema;

export namespace UserPlanStripeTableSchema {
	export type Type = z.infer<UserPlanStripeTableSchema>;
}
