import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const UserResourceLimitTableSchema = z
	.looseObject({
		userId: z.string().meta({
			description: "ID of the user owning the limit row",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		reference: z.string().nullable().meta({
			description: "Optional per-entity override reference",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when the limit becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description: "Timestamp when the limit stops being active",
			type: "string",
		}),
		limit: z.coerce.number().meta({
			description: "Effective limit value for the resource",
			type: "number",
		}),
	})
	.meta({
		id: "UserResourceLimitTable",
		description: "Database row for a user resource limit.",
	})
	.strip();

export type UserResourceLimitTableSchema = typeof UserResourceLimitTableSchema;

export namespace UserResourceLimitTableSchema {
	export type Type = z.infer<UserResourceLimitTableSchema>;
}
