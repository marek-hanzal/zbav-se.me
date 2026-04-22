import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

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
		restriction: RestrictionEnumSchema.meta({
			description: "Restriction levels applied to the user",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when the user restriction becomes available",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the user restriction expires",
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
