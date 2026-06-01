import { z } from "zod";

export const UserPlanTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user plan assignment",
		}),
		userId: z.string().meta({
			description: "ID of the user assigned to the plan",
		}),
		planId: z.string().meta({
			description: "ID of the assigned monetization plan",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when the plan assignment becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the plan assignment stops being active",
			type: "string",
		}),
	})
	.meta({
		id: "UserPlanTable",
		description: "Database row for a user monetization plan assignment.",
	})
	.strip();

export type UserPlanTableSchema = typeof UserPlanTableSchema;

export namespace UserPlanTableSchema {
	export type Type = z.infer<UserPlanTableSchema>;
}
