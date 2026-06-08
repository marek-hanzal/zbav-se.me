import { z } from "zod";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";

export const UserResourceBundleItemTableSchema = z
	.looseObject({
		id: z.string().meta({
			description: "Unique ID of the user resource bundle item row",
		}),
		userResourceBundleId: z.string().meta({
			description: "ID of the owning user resource bundle assignment",
		}),
		resourceDefinitionId: ResourceDefinitionEnumSchema.meta({
			description: "Referenced resource definition name",
		}),
		amount: z.coerce.number().meta({
			description: "Item amount granted to the user",
			type: "number",
		}),
		createdAt: z.coerce.date().meta({
			description: "Creation timestamp",
			type: "string",
		}),
		availableAt: z.coerce.date().meta({
			description: "Timestamp when this item becomes active",
			type: "string",
		}),
		expiresAt: z.coerce.date().nullable().meta({
			description:
				"Timestamp when this item stops being active; null means it does not expire",
			type: "string",
		}),
	})
	.meta({
		id: "UserResourceBundleItemTable",
		description: "Snapshot row for a resource item granted to a user.",
	})
	.strip();

export type UserResourceBundleItemTableSchema = typeof UserResourceBundleItemTableSchema;

export namespace UserResourceBundleItemTableSchema {
	export type Type = z.infer<UserResourceBundleItemTableSchema>;
}
