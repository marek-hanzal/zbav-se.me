import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const UserResourceBundleLimitTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user resource bundle limit row",
		}),
		userResourceBundleId: z.string().meta({
			description: "ID of the owning user resource bundle assignment",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		limit: z.coerce.number().meta({
			description: "Limit value granted to the user",
			type: "number",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when this limit becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullish().meta({
			description:
				"Timestamp when this limit stops being active; null means it does not expire",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleLimitTable",
		description: "Snapshot row for a resource limit granted to a user.",
	})
	.strip();

export type UserResourceBundleLimitTableSchema = typeof UserResourceBundleLimitTableSchema;

export namespace UserResourceBundleLimitTableSchema {
	export type Type = z.infer<UserResourceBundleLimitTableSchema>;
}
