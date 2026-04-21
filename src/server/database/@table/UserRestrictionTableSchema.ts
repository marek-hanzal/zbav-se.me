import { z } from "zod";
import { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";

export const UserRestrictionTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "ID of the user restriction",
		}),
		userId: z.string().meta({
			description: "ID of the restricted user",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		restriction: CategoryRestrictionEnumSchema.meta({
			description: "Restriction levels applied to the user",
		}),
		availableAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the user restriction becomes available",
		}),
	})
	.meta({
		id: "UserRestrictionTable",
		description: "Database row for a user restriction.",
	})
	.strip();

export type UserRestrictionTableSchema = typeof UserRestrictionTableSchema;

export namespace UserRestrictionTableSchema {
	export type Type = z.infer<UserRestrictionTableSchema>;
}
